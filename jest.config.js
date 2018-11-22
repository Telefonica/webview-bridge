module.exports = {
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx|js)$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        },
    },
    testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
    preset: 'ts-jest/presets/js-with-ts',
    collectCoverage: true,
    collectCoverageFrom: ['**/src/*.{ts}', '!**/__tests__/**', '!**/dist/**'],
};
