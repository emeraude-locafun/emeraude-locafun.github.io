/// <reference lib="webworker" />

// Cette déclaration permet à TypeScript de comprendre que 'self' est le Service Worker
declare const self: ServiceWorkerGlobalScope;

// --- INTERFACES & CONFIGURATION ---

interface GithubConfig {
  user: string;
  repo: string;
  branch: string;
}

interface ServiceConfig {
  targetDomain: string;
  github: GithubConfig;
  checkThreshold: number;
  cachePrefix: string;
}

const CONFIG: ServiceConfig = {
  targetDomain: 'emeraude-locafun.github.io',
  github: {
    user: 'emeraude-locafun',
    repo: 'emeraude-locafun.github.io',
    branch: 'main',
  },
  checkThreshold: 50,
  cachePrefix: 'mon-projet-cache-',
};

// Configuration IndexedDB
const DB_CONFIG = {
  name: 'SW-Version-DB',
  version: 1,
  store: 'settings',
  key: 'current_sha',
} as const;

// --- ÉTAT GLOBAL ---

let memorySha: string | null = null;
let requestCounter: number = 0;

const GITHUB_API_URL = `https://api.github.com/repos/${CONFIG.github.user}/${CONFIG.github.repo}/commits/${CONFIG.github.branch}`;

// --- HELPER INDEXEDDB (Promisified) ---

const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(DB_CONFIG.store)) {
      db.createObjectStore(DB_CONFIG.store);
    }
  };

  request.onsuccess = (event: Event) => {
    resolve((event.target as IDBOpenDBRequest).result);
  };

  request.onerror = (event: Event) => {
    reject((event.target as IDBOpenDBRequest).error);
  };
});

async function getStoredSHA(): Promise<string | undefined> {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readonly');
    const store = tx.objectStore(DB_CONFIG.store);
    const req = store.get(DB_CONFIG.key);

    req.onsuccess = () => resolve(req.result as string | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function setStoredSHA(sha: string): Promise<void> {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.store);
    const req = store.put(sha, DB_CONFIG.key);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- CYCLE DE VIE DU SERVICE WORKER ---

self.addEventListener('install', (event: ExtendableEvent) => {
  self.skipWaiting();
  console.log('[SW-TS] Installation...');

  event.waitUntil(
    (async () => {
      try {
        const latestSha = await fetchGitHubSHA();
        await setStoredSHA(latestSha);
        memorySha = latestSha;
        console.log(`[SW-TS] Initialisé avec SHA: ${latestSha}`);
      } catch (e) {
        console.log(
          '[SW-TS] Install hors-ligne, on utilisera la valeur existante en DB.'
        );
      }
    })()
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
  console.log('[SW-TS] Activé');
});

// --- INTERCEPTION DES REQUÊTES ---

self.addEventListener('fetch', (event: FetchEvent) => {

  const url = new URL(event.request.url);
//    console.error(`[SW-TS] Intercepted request to: ${url.href} + ${url.hostname} `)
  // Filtrage du domaine cible
  if (url.hostname === CONFIG.targetDomain) {
    requestCounter++;

    event.respondWith(
      (async (): Promise<Response> => {
        // 1. Initialisation lazy du SHA en mémoire
        if (!memorySha) {
          memorySha = (await getStoredSHA()) || null;
        }

        const currentShaKey = memorySha || 'default';
        const cacheName = CONFIG.cachePrefix + currentShaKey;

        // 2. Cache First Strategy
        const cachedResponse = await caches.match(event.request, { cacheName });

        if (cachedResponse) {
          // Vérification asynchrone (ne bloque pas la réponse)
          checkInvalidationLogic();
          return cachedResponse;
        }

        // 3. Fallback Réseau
        try {
            console.error(`[SW-TS] Fetching from network: ${url.href}`)
          const networkResponse = await fetch(event.request);

          // Vérification validité réponse avant cache
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          const cache = await caches.open(cacheName);
          await cache.put(event.request, responseToCache);

          return networkResponse;
        } catch (error) {
          console.error('[SW-TS] Fetch failed:', error);
          throw error;
        }
      })()
    );
  }
});

// --- LOGIQUE METIER ---

function checkInvalidationLogic(): void {
  if (requestCounter >= CONFIG.checkThreshold) {
    console.log(
      `[SW-TS] Seuil atteint (${requestCounter}). Vérification GitHub...`
    );
    requestCounter = 0;
    checkForUpdate().catch((err) => console.warn('[SW-TS] Check failed', err));
  }
}

async function checkForUpdate(): Promise<void> {
  const latestSha = await fetchGitHubSHA();

  if (!memorySha) {
    memorySha = (await getStoredSHA()) || null;
  }

  // Si on a un SHA local et qu'il diffère du distant
  if (memorySha && latestSha !== memorySha) {
    console.log(
      `[SW-TS] ⚠️ UPDATE (Old: ${memorySha.substring(0, 7)} -> New: ${latestSha.substring(0, 7)})`
    );

    // 1. Supprimer l'ancien cache
    const oldCacheName = CONFIG.cachePrefix + memorySha;
    await caches.delete(oldCacheName);
    console.log(`[SW-TS] Cache ${oldCacheName} supprimé.`);

    // 2. Mettre à jour la persistance
    await setStoredSHA(latestSha);
    memorySha = latestSha;

    console.log('[SW-TS] Prêt pour la nouvelle version.');
  } else {
    // Premier run ou pas de changement
    if (!memorySha) {
      await setStoredSHA(latestSha);
      memorySha = latestSha;
    }
  }
}

async function fetchGitHubSHA(): Promise<string> {
  // Timestamp pour éviter le cache HTTP sur l'appel API
  const response = await fetch(`${GITHUB_API_URL}?t=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  const data = (await response.json()) as { sha: string };
  return data.sha;
}