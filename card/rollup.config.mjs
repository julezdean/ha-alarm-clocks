import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/alarm-clocks-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: dev,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    ...(dev ? [] : [terser({ format: { comments: false } })]),
  ],
};
