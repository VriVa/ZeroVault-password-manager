// ...existing code...
const encoder = new TextEncoder()

export async function deriveKeyPBKDF2(password, salt, iterations = 100_000, lengthBytes = 32) {
  const pwKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: typeof salt === 'string' ? encoder.encode(salt) : salt,
      iterations,
      hash: 'SHA-256',
    },
    pwKey,
    lengthBytes * 8
  )
  return new Uint8Array(bits)
}

function bytesToBigInt(bytes) {
  let hex = []
  bytes.forEach(b => hex.push(b.toString(16).padStart(2, '0')))
  return BigInt('0x' + hex.join(''))
}

function modPow(base, exponent, modulus) {
  base = base % modulus
  let result = 1n
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % modulus
    exponent >>= 1n
    base = (base * base) % modulus
  }
  return result
}

// RFC 3526 2048-bit MODP Group (hex) - demo purposes only
const P_HEX = `
FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E08
8A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431
B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42
E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1
FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A6916
3FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096
966D670C354E4ABC9804F1746C08CA237327FFFFFFFFFFFFFFFF
`.replace(/\s+/g, '')
const P = BigInt('0x' + P_HEX)
const G = 2n

// Derive x from password+salt and compute Y = g^x mod p
export async function computePublicY(password, salt = 'zkp-demo-salt') {
  const dk = await deriveKeyPBKDF2(password, salt, 200_000, 64) // 512 bits
  const x = bytesToBigInt(dk)
  const Y = modPow(G, x, P)
  return { x, Y }
}

// Schnorr helpers (server should provide challenge c as BigInt)
export function createSchnorrProof() {
  // choose random r in [1, p-2]
  const byteLen = 64
  const rv = new Uint8Array(byteLen)
  crypto.getRandomValues(rv)
  const r = bytesToBigInt(rv) % (P - 2n) + 1n
  const R = modPow(G, r, P)
  return { r, R }
}

export function finalizeSchnorrSignature(r, x, c) {
  // s = (r + c*x) mod (p-1)
  const s = (r + c * x) % (P - 1n)
  return s
}

// helpers to serialize BigInt <-> hex
export function bigIntToHex(b) {
  return b.toString(16)
}
export function hexToBigInt(h) {
  return BigInt('0x' + h)
}
// ...existing code...