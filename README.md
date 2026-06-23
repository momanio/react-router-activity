# react-router-activity

> Preserve route state across navigation in React Router 7+ using React 19.2's native `<Activity>` component.

By default, React Router unmounts your route component every time the user navigates away — losing scroll position, form state, and triggering redundant network requests on back-navigation. This package fixes that.

## Requirements

- React 19.2+
- React Router 7+

## Installation

```bash
npm install react-router-activity
```

## Usage

Replace `<Outlet />` with `<ActivityOutlet />` in your root layout:

```tsx
import { ActivityOutlet } from "react-router-activity";

export function RootLayout() {
  return (
    <div>
      <nav>...</nav>
      <ActivityOutlet max={5} />
    </div>
  );
}
```

That's it. Up to `max` previously visited routes are kept alive in memory. The least recently used route is evicted when the limit is exceeded.

## Props

### `<ActivityOutlet>`

| Prop  | Type     | Default | Description                                        |
| ----- | -------- | ------- | -------------------------------------------------- |
| `max` | `number` | `5`     | Maximum number of routes kept alive simultaneously |

## Hook

Use `useOnActivity` inside any route component to react to visibility changes:

```tsx
import { useOnActivity } from "react-router-activity";

export function ProductsPage() {
  useOnActivity({
    onActive: () => console.log("route visible — resume polling"),
    onInactive: () => console.log("route hidden — pause polling"),
  });

  return <div>...</div>;
}
```

## How it works

- Uses React 19.2's native `unstable_Activity` for fiber-compliant visibility — no portal hacks
- Freezes hidden route context to prevent cascade re-renders on navigation
- LRU eviction automatically unmounts the oldest route when `max` is exceeded
- Falls back to `display:none` on React < 19.2

## License

MIT
EOF
