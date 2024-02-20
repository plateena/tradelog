export default {
    rootDir: "./",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/tests/**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    runner: "groups",
    setupFiles: [
        "./tests/jest.setup.ts"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    collectCoverageFrom: [
        "<rootDir>/**/*.ts"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "./server.ts",
        "./types"
    ]
};
