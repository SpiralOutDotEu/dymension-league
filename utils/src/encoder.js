export function encodeAttributes(capacity, attack, speed, shield) {
  let encoded = 0;
  encoded |= (capacity - 2) << 12;
  encoded |= (attack - 2) << 8;
  encoded |= (speed - 2) << 4;
  encoded |= shield - 2;
  return encoded;
}

export function decodeAttributes(encoded) {
  return {
    capacity: ((encoded >> 12) & 0xf) + 2,
    attack: ((encoded >> 8) & 0xf) + 2,
    speed: ((encoded >> 4) & 0xf) + 2,
    shield: (encoded & 0xf) + 2,
  };
}
