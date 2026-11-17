import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  watchman: false,
  testPathIgnorePatterns: ["<rootDir>/infra/"],
};

export default createJestConfig(config);
