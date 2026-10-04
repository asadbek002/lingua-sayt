const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(
  identifier: string,
  limit = RATE_LIMIT,
  windowMs = WINDOW_MS
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requestCounts.get(identifier);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
