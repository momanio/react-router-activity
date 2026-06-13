import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ActivityOutlet } from "../src/ActivityOutlet";
import { describe, it, expect } from "vitest";

function TestLayout() {
  return (
    <div>
      <ActivityOutlet max={3} />
    </div>
  );
}

describe("ActivityOutlet", () => {
  it("renders the active route", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route element={<TestLayout />}>
            <Route path="/home" element={<div>Home page</div>} />
            <Route path="/about" element={<div>About page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("preserves state of previously visited routes", () => {
    // A stateful counter component
    function Counter() {
      const [n, setN] = React.useState(0);
      return <button onClick={() => setN((x) => x + 1)}>count: {n}</button>;
    }

    const { getByText } = render(
      <MemoryRouter initialEntries={["/counter"]}>
        <Routes>
          <Route element={<TestLayout />}>
            <Route path="/counter" element={<Counter />} />
            <Route path="/other" element={<div>Other</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Counter rendered
    expect(getByText("count: 0")).toBeInTheDocument();
  });
});
