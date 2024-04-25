import { encodeAttributes, decodeAttributes } from './encoder';

test('encodes and decodes attributes correctly', () => {
  const capacity = 2, attack = 4, speed = 6, shield = 8;
  const encoded = encodeAttributes(capacity, attack, speed, shield);
  const decoded = decodeAttributes(encoded);
  expect(decoded.capacity).toBe(capacity);
  expect(decoded.attack).toBe(attack);
  expect(decoded.speed).toBe(speed);
  expect(decoded.shield).toBe(shield);
});
