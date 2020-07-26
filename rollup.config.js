import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import gzipPlugin from "rollup-plugin-gzip";

import pkg from "./package.json";

export default {
  input: "lib/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    typescript({
      typescript: require("typescript"),
      rollupCommonJSResolveHack: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: "./typings",
          declarationMap: true,
        },
      },
      exclude: "**/tests/**",
      clean: true,
    }),
    commonjs({
      include: ["node_modules/**"],
    }),
    gzipPlugin(),
    filesize(),
    terser(),
  ],
};
