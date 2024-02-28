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
    moduleNameMapper: {
        "^~/(.*)$": "<rootDir>/$1",
        "^@config/(.*)$": "<rootDir>/config/$1",
        "^@factories/(.*)$": "<rootDir>/tests/factories/$1",
        "^@middleware/(.*)$": "<rootDir>/middleware/$1",
        "^@models/(.*)$": "<rootDir>/models/$1",
        "^@routes/(.*)$": "<rootDir>/routes/$1",
        "^@services/(.*)$": "<rootDir>/services/$1",
        "^@tests/(.*)$": "<rootDir>/tests/$1",
        "^@type/(.*)$": "<rootDir>/types/$1",
    },
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
