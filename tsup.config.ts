import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/either/either.ts", "src/maybe/maybe.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
});
