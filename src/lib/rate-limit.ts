const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const store = rateLimitStore.get(key) || { count: 0, lastReset: now };

  if (now - store.lastReset > windowMs) {
    store.count = 1;
    store.lastReset = now;
  } else {
    store.count++;
  }

  rateLimitStore.set(key, store);

  return store.count <= limit;
}
