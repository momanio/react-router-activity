import React, { useState } from "react";
import { render, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ActivityContext } from "../src/ActivityContext";
import { useOnActivity } from "../src/useOnActivity";

// Helper: a component that calls useOnActivity and exposes callbacks
function Watcher({
  onActive,
  onInactive,
}: {
  onActive?: () => void;
  onInactive?: () => void;
}) {
  useOnActivity({ onActive, onInactive });
  return null;
}

// Helper: wraps Watcher in a controllable ActivityContext
function TestHarness({
  initialActive,
  onActive,
  onInactive,
}: {
  initialActive: boolean;
  onActive?: () => void;
  onInactive?: () => void;
}) {
  const [isActive, setIsActive] = useState(initialActive);
  return (
    <>
      <button onClick={() => setIsActive((v) => !v)}>toggle</button>
      <ActivityContext.Provider value={{ isActive }}>
        <Watcher onActive={onActive} onInactive={onInactive} />
      </ActivityContext.Provider>
    </>
  );
}

describe("useOnActivity", () => {
  it("fires onInactive when route becomes hidden", () => {
    const onInactive = vi.fn();
    const { getByText } = render(
      <TestHarness initialActive={true} onInactive={onInactive} />,
    );

    act(() => {
      getByText("toggle").click();
    });

    expect(onInactive).toHaveBeenCalledTimes(1);
  });

  it("fires onActive when route becomes visible again", () => {
    const onActive = vi.fn();
    const { getByText } = render(
      <TestHarness initialActive={false} onActive={onActive} />,
    );

    act(() => {
      getByText("toggle").click();
    });

    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it("does not fire onActive on initial mount when already active", () => {
    const onActive = vi.fn();
    render(<TestHarness initialActive={true} onActive={onActive} />);
    expect(onActive).not.toHaveBeenCalled();
  });

  it("does not fire onInactive on initial mount when already hidden", () => {
    const onInactive = vi.fn();
    render(<TestHarness initialActive={false} onInactive={onInactive} />);
    expect(onInactive).not.toHaveBeenCalled();
  });
});
