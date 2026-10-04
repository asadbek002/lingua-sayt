"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

// Next.js navigates between pages without a full reload, so Metrika must be told about each new page.
export default function PageViewTracker() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname && !pathname.startsWith("/admin")) {
      trackPageView(window.location.href);
    }
    previous.current = pathname;
  }, [pathname]);

  return null;
}
