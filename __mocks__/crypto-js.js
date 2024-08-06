// __mocks__/crypto-js.js
module.exports = {
  SHA256: jest.fn().mockImplementation((message) => ({
    words: Array(8).fill(0).map((_, i) => i),
  })),
};
