//unused by tanish for future implementation
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { hkdf } from '@noble/hashes/hkdf';
import argon2 from 'argon2-browser';

// Generate random salt (16 bytes)
export function generateSalt() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return salt;
}

// Convert Uint8Array to base64
export function arrayToBase64(arr) {
  return btoa(String.fromCharCode(...arr));
}

// Convert base64 to Uint8Array
export function base64ToArray(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Derive root key using Argon2id
export async function deriveRootKey(password, salt, kdfParams) {
  try {
    const result = await argon2.hash({
      pass: password,
      salt: salt,
      type: argon2.ArgonType.Argon2id,
      mem: kdfParams.mem_kib,
      time: kdfParams.iter,
      parallelism: kdfParams.par,
      hashLen: 32, // 32 bytes = 256 bits
    });
    
    return result.hash; // Uint8Array(32)
  } catch (error) {
    console.error('Argon2 derivation failed:', error);
    throw new Error('Key derivation failed');
  }
}

// Generate EC Schnorr keypair from root key
export function generateECKeyPair(rootKey) {
  // Convert rootKey bytes to BigInt
  const privateKeyBigInt = BigInt('0x' + Array.from(rootKey).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Reduce mod curve order to ensure valid private key
  const privateKey = privateKeyBigInt % secp256k1.CURVE.n;
  
  // Generate public key Y = x * G
  const publicKeyPoint = secp256k1.ProjectivePoint.BASE.multiply(privateKey);
  const publicKeyCompressed = publicKeyPoint.toRawBytes(true); // 33 bytes compressed
  
  return {
    privateKey: privateKey,
    publicKey: arrayToBase64(publicKeyCompressed)
  };
}

// Derive AES vault key using HKDF
export function deriveVaultKey(rootKey) {
  const info = new TextEncoder().encode('vault-encryption-key');
  const derivedKey = hkdf(sha256, rootKey, undefined, info, 32); // 32 bytes for AES-256
  return derivedKey;
}

// AES-256-GCM Encryption
export async function encryptVault(vaultData, aesKey) {
  const iv = new Uint8Array(12); // 12 bytes for GCM
  crypto.getRandomValues(iv);
  
  const plaintext = new TextEncoder().encode(JSON.stringify(vaultData));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    aesKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128 // 16 bytes auth tag
    },
    cryptoKey,
    plaintext
  );
  
  // Split ciphertext and tag
  const ciphertextArray = new Uint8Array(ciphertext);
  const actualCiphertext = ciphertextArray.slice(0, -16);
  const tag = ciphertextArray.slice(-16);
  
  return {
    iv: arrayToBase64(iv),
    ciphertext: arrayToBase64(actualCiphertext),
    tag: arrayToBase64(tag)
  };
}

// AES-256-GCM Decryption
export async function decryptVault(encryptedData, aesKey) {
  try {
    const iv = base64ToArray(encryptedData.iv);
    const ciphertext = base64ToArray(encryptedData.ciphertext);
    const tag = base64ToArray(encryptedData.tag);
    
    // Combine ciphertext and tag for Web Crypto API
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      aesKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128
      },
      cryptoKey,
      combined
    );
    
    const plaintext = new TextDecoder().decode(decrypted);
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt vault');
  }
}

// Password strength checker
export function checkPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return { level: 'weak', color: 'red', score: strength };
  if (strength <= 4) return { level: 'medium', color: 'yellow', score: strength };
  return { level: 'strong', color: 'green', score: strength };
}
