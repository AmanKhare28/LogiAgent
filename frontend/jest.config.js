/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
  moduleNameMapper: { "\\.(css|less|scss)$": "identity-obj-proxy" },
};
