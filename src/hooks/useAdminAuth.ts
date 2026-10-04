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
    // During hydration `token` is still the empty server snapshot, so ask the storage directly:
    // only a visitor who really has no token is sent to the login page (reloads keep the current page).
    if (!getAdminToken() && !redirected.current) {
      redirected.current = true;
      router.replace(`/admin?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  const logout = () => {
    clearAdminToken();
    router.replace("/admin");
  };

  return { password: token, ready: !!token, logout };
}
