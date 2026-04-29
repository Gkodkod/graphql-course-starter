module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-fixed-jsdom",
  testMatch: ["**/src/**/*.test.ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  // msw v2 has many ESM-only transitive deps.
  // pnpm stores packages at: node_modules/.pnpm/<pkg>@ver/node_modules/<pkg>/
  // so each path contains TWO `node_modules/` segments — both must be handled.
  // Pattern 1: ignore regular node_modules EXCEPT .pnpm dir and the ESM pkgs.
  // Pattern 2: inside .pnpm, ignore everything EXCEPT the ESM pkgs we need.
  transformIgnorePatterns: [
    "/node_modules/(?!\\.pnpm|msw|@mswjs|@open-draft|rettime|until-async|headers-polyfill|outvariant|strict-event-emitter|is-node-process)",
    "/node_modules/\\.pnpm/(?!(msw|@mswjs|@open-draft|rettime|until-async|headers-polyfill|outvariant|strict-event-emitter|is-node-process))",
  ],
  // ts-jest must also handle .mjs files emitted by ESM-only packages.
  transform: {
    "^.+\\.(ts|tsx|js|jsx|mjs)$": [
      "ts-jest",
      {
        tsconfig: {
          target: "es2020",
        },
      },
    ],
  },
};
