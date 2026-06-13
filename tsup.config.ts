import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // ships both — supports all consumers
  dts: true, // generates .d.ts type files automatically
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react-router-dom", "react-router"],
  treeshake: true,
});
