// __mocks__/@helia/unixfs.js
module.exports = jest.fn().mockImplementation(() => ({
  addBytes: jest.fn().mockResolvedValue({
    toString: jest.fn().mockReturnValue('mocked-cid'),
  }),
  cat: jest.fn().mockReturnValue({
    [Symbol.asyncIterator]: jest.fn().mockReturnValue({
      next: jest.fn().mockResolvedValue({ value: new Uint8Array([0, 1, 2]), done: false }),
      return: jest.fn().mockResolvedValue({ done: true }),
    }),
  }),
}));
