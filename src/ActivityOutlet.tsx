import React, { ReactNode, useLayoutEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { FrozenRouteProvider } from "./FrozenRouteProvider";

export interface ActivityOutletProps {
  /**
   * Maximum number of routes kept alive in memory simultaneously.
   * Least-recently-used routes are evicted once this limit is exceeded.
   * @default 5
   */
  max?: number;
}

interface CacheEntry {
  key: string;
  element: ReactNode;
  lastAccessed: number;
}

/**
 * Drop-in replacement for React Router's <Outlet />.
 * Keeps visited routes alive using React 19.2's <Activity> instead of
 * unmounting them, preserving scroll position, form state, and
 * preventing redundant network requests on back-navigation.
 *
 * @example
 * // In your root layout — replace <Outlet /> with this:
 * <ActivityOutlet max={5} />
 */
export function ActivityOutlet({ max = 5 }: ActivityOutletProps) {
  const currentOutlet = useOutlet();
  const { pathname, search } = useLocation();
  const activeKey = pathname + search;

  const [cache, setCache] = useState<Record<string, CacheEntry>>({});

  useLayoutEffect(() => {
    if (!currentOutlet) return;

    setCache((prev) => {
      const now = Date.now();
      const next = { ...prev };

      // Insert or refresh the current route
      next[activeKey] = {
        key: activeKey,
        element: currentOutlet,
        lastAccessed: now,
      };

      // Evict the least recently accessed entry if over the limit
      const keys = Object.keys(next);
      if (keys.length > max) {
        const oldest = keys.sort(
          (a, b) => next[a].lastAccessed - next[b].lastAccessed,
        )[0];
        delete next[oldest];
      }

      return next;
    });
  }, [activeKey, currentOutlet, max]);

  return (
    <div data-rra-outlet style={{ position: "relative" }}>
      {Object.values(cache).map((entry) => (
        <FrozenRouteProvider
          key={entry.key}
          routeKey={entry.key}
          isVisible={entry.key === activeKey}
        >
          {entry.element}
        </FrozenRouteProvider>
      ))}
    </div>
  );
}
