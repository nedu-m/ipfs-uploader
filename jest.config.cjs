// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^helia$': '<rootDir>/__mocks__/helia.js',
    '^@helia/unixfs$': '<rootDir>/__mocks__/@helia/unixfs.js',
    '^blockstore-core$': '<rootDir>/__mocks__/blockstore-core.js',
    '^datastore-core$': '<rootDir>/__mocks__/datastore-core.js',
    '^libp2p$': '<rootDir>/__mocks__/libp2p.js',
    '^@libp2p/identify$': '<rootDir>/__mocks__/@libp2p/identify.js',
    '^@chainsafe/libp2p-noise$': '<rootDir>/__mocks__/@chainsafe/libp2p-noise.js',
    '^@chainsafe/libp2p-yamux$': '<rootDir>/__mocks__/@chainsafe/libp2p-yamux.js',
    '^@libp2p/websockets$': '<rootDir>/__mocks__/@libp2p/websockets.js',
    '^@libp2p/bootstrap$': '<rootDir>/__mocks__/@libp2p/bootstrap.js',
    '^@/components/ui/card$': '<rootDir>/__mocks__/components/ui/card.js',
    '^@/components/ui/button$': '<rootDir>/__mocks__/components/ui/button.js',
    '^crypto-js$': '<rootDir>/__mocks__/crypto-js.js',
  },
};

module.exports = createJestConfig(config);
