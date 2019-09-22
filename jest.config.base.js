module.exports = {
  coverageDirectory: "<rootDir>/../coverage",
  coverageReporters: ["text-summary", "json-summary", "lcov", "text"],
  preset: "ts-jest",
  testEnvironment: process.env.testEnvironment || "node",
  verbose: true,
};
