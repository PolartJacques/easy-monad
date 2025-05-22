import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/either/index.ts", "src/maybe/index.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
});
