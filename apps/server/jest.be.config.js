module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"], // matches test files within the server workspace
  transform: {
    "\\.(graphql)$": "@graphql-tools/jest-transform",
    "^.+\\.ts?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
};
