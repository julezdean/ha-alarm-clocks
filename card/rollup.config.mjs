import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH === "true";

const shared = { format: "es", inlineDynamicImports: true };

/**
 * A real build writes the bundle twice: to dist/ and to the copy under
 * custom_components/ that actually ships with the integration. Keeping the
 * second write here rather than in a separate step means the shipped bundle
 * cannot fall behind its source, which is what the CI check guards against.
 *
 * Watch builds write only dist/: they are unminified and carry a sourcemap
 * reference, so committing one would leave the shipped bundle disagreeing with
 * a production build of the same source.
 */
const output = [{ ...shared, file: "dist/alarm-clocks-card.js", sourcemap: dev }];

if (!dev) {
  output.push({
    ...shared,
    file: "../custom_components/alarm_clocks/frontend/alarm-clocks-card.js",
    sourcemap: false,
  });
}

export default {
  input: "src/main.ts",
  output,
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    ...(dev ? [] : [terser({ format: { comments: false } })]),
  ],
};
