export function sanitizeText(input: string): string {
  return input
    // Output is rendered by React (escaped) and Telegram HTML is escaped separately; just strip tags and control chars.
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim();
}

export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}
