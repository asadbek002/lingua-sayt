"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";

const subscribe = () => () => {};

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  // Server snapshot is "" so hydration matches; the client re-renders with the real token afterwards
  const token = useSyncExternalStore(subscribe, () => getAdminToken() ?? "", () => "");
  const redirected = useRef(false);

  useEffect(() => {
    // Only router navigation in the effect, never setState
    if (!token && !redirected.current) {
      redirected.current = true;
      router.replace(`/admin?next=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  const logout = () => {
    clearAdminToken();
    router.replace("/admin");
  };

  return { password: token, ready: !!token, logout };
}
