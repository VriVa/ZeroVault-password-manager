const p = 1000003; // Same prime as backend

export async function computePublicY(rootKey) {
  // Deterministic: convert rootKey bytes to a number mod p
  let num = 0;
  for (let i = 0; i < rootKey.length; i++) {
    num = (num * 256 + rootKey[i]) % p;
  }
  const Y = num;
  return { x: Y, publicY: Y.toString() };
}

export async function generateProof(x, challenge_c) {
  // Demo: R is a random integer mod p
  const R = Math.floor(Math.random() * p);
  // s = R + c * x mod p
  const s = (R + challenge_c * x) % p;
  return {
    R: R.toString(),
    s: s.toString()
  };
}