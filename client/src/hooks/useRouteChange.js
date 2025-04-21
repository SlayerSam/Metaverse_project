"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useRouteChange() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // initial load
    if (isLoading) return;

    if (pathname !== prevPath.current) {
      setIsLoading(true);
      prevPath.current = pathname;
    }
  }, [pathname]);

  const finishLoading = () => setIsLoading(false);

  return { isLoading, finishLoading };
}
