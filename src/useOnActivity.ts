import { useContext, useLayoutEffect, useRef } from "react";
import { ActivityContext } from "./ActivityContext";

export interface UseOnActivityOptions {
  onActive?: () => void;
  onInactive?: () => void;
}

/**
 * Hook that fires callbacks when the nearest ActivityOutlet
 * shows or hides the current route.
 *
 * @example
 * useOnActivity({
 *   onActive: () => analytics.track("page_view"),
 *   onInactive: () => player.pause(),
 * });
 */
export function useOnActivity({
  onActive,
  onInactive,
}: UseOnActivityOptions): void {
  const { isActive } = useContext(ActivityContext);
  const prevRef = useRef<boolean>(isActive);

  useLayoutEffect(() => {
    if (isActive && !prevRef.current) {
      onActive?.();
    } else if (!isActive && prevRef.current) {
      onInactive?.();
    }
    prevRef.current = isActive;
  }, [isActive, onActive, onInactive]);
}
