const KEY = "lingua-admin";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {}
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

export function adminHeaders(token: string, json = false): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

/** Opens a protected file in a new tab (fetch with the token, then open as a blob). */
export async function openAdminFile(token: string, fileUrl: string): Promise<void> {
  const res = await fetch(fileUrl, { headers: adminHeaders(token) });
  if (!res.ok) throw new Error(res.status === 404 ? "Файл не найден на сервере" : "Не удалось открыть файл");
  const blob = await res.blob();
  window.open(URL.createObjectURL(blob), "_blank", "noopener");
}
