// __tests__/digestMessage.test.js
import { digestMessage } from '../components/ipfs_uploader';

test('digestMessage should return the SHA-256 hash of the message', async () => {
  const message = 'hello world';
  const hash = await digestMessage(message);
  expect(hash).toBeInstanceOf(Uint8Array);
  expect(hash.length).toBe(32); // SHA-256 hash length is 32 bytes
});
