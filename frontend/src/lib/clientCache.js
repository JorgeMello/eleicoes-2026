/**
 * Cache local ultrarrápido (Memória + SessionStorage)
 * Implementa o padrão SWR (Stale-While-Revalidate) para renderização instantânea (0ms).
 */

const memoryCache = new Map();
const PREFIX = 'eleicoes2026_cache_';
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutos

export const clientCache = {
  get(key) {
    // 1. Tenta memória RAM (mais rápido: 0.01ms)
    if (memoryCache.has(key)) {
      const item = memoryCache.get(key);
      if (Date.now() - item.timestamp < DEFAULT_TTL_MS) {
        return item.data;
      }
      memoryCache.delete(key);
    }

    // 2. Tenta sessionStorage (persiste durante a aba aberta)
    try {
      const raw = sessionStorage.getItem(PREFIX + key);
      if (raw) {
        const item = JSON.parse(raw);
        if (Date.now() - item.timestamp < DEFAULT_TTL_MS) {
          memoryCache.set(key, item); // hidrata memória
          return item.data;
        }
        sessionStorage.removeItem(PREFIX + key);
      }
    } catch {
      // Ignora erro de cota ou storage privado
    }

    return null;
  },

  set(key, data) {
    const item = { data, timestamp: Date.now() };
    memoryCache.set(key, item);
    try {
      sessionStorage.setItem(PREFIX + key, JSON.stringify(item));
    } catch {
      // Se estourar a cota de storage, mantém apenas em memória
    }
  },

  clear() {
    memoryCache.clear();
    try {
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith(PREFIX)) sessionStorage.removeItem(k);
      });
    } catch {
      // Ignora
    }
  },
};
