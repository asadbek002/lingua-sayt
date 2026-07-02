"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  // Read sessionStorage once, synchronously, at component init — avoids setState-in-effect
  const [token] = useState<string>(() => getAdminToken() ?? "");
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
