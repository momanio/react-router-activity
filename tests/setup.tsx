import "@testing-library/jest-dom";
import React from "react";

if (!(React as any)["unstable_Activity"]) {
  (React as any)["unstable_Activity"] = ({
    children,
    mode,
  }: {
    children: React.ReactNode;
    mode: string;
  }) => (mode === "visible" ? <>{children}</> : null);
}
