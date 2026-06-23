import React, { ReactNode, useRef } from "react";
import { ActivityContext } from "./ActivityContext";

// Safe import — unstable_Activity exists in React 19.2+, undefined in older versions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Activity = (React as any)["unstable_Activity"] as
  | React.ComponentType<{ mode: "visible" | "hidden"; children: ReactNode }>
  | undefined;

interface FrozenRouteProviderProps {
  isVisible: boolean;
  children: ReactNode;
  routeKey: string;
}


export function FrozenRouteProvider({
  isVisible,
  children,
  routeKey,
}: FrozenRouteProviderProps) {
  const frozenRef = useRef<ReactNode>(children);

  if (isVisible) {
    frozenRef.current = children;
  }

  // When React 19.2+ unstable_Activity is active, it expects a React element as its child.
  // Raw strings or numbers can cause issues with the reconciler in some scenarios,
  // so we wrap them in a span if Activity is available. Otherwise, React handles
  // primitive children gracefully with `display:none` fallback.
  const currentChildren =
    Activity &&
    (typeof frozenRef.current === "string" ||
      typeof frozenRef.current === "number")
      ? <span className="rra-text-guard">{frozenRef.current}</span>
      : frozenRef.current;

  const content = (
    <ActivityContext.Provider value={{ isActive: isVisible }}>
      <div
        data-rra-route={routeKey}
        style={{ display: isVisible ? "contents" : "none" }}
      >
        {currentChildren}
      </div>
    </ActivityContext.Provider>
  );

  // If React 19.2+ Activity is available, wrap with it for proper lane scheduling.
  // Falls back to display:none approach on older React versions.
  if (Activity) {
    return (
      <Activity mode={isVisible ? "visible" : "hidden"}>{content}</Activity>
    );
  }

  return content;
}
