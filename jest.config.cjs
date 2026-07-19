
const esModules = [
    'squares-rng'
].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    resolver: "jest-ts-webcompat-resolver",
    // setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/jest.setup.ts'],
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    collectCoverage: false,  // Make true again!
    coverageProvider: 'v8',
    testTimeout: 15000,
    passWithNoTests: true,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    },
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`
    ]
};