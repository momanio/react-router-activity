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

function sanitizeChildren(children: ReactNode): ReactNode {
  if (typeof children === "string" || typeof children === "number") {
    return <span className="rra-text-guard">{children}</span>;
  }
  return children;
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

  const content = (
    <ActivityContext.Provider value={{ isActive: isVisible }}>
      <div
        data-rra-route={routeKey}
        style={{ display: isVisible ? "contents" : "none" }}
      >
        {sanitizeChildren(frozenRef.current)}
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
