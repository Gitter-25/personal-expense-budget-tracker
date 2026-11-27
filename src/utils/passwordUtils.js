import * as Crypto from "expo-crypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

const ITERATIONS = 600000;

// Derive a password hash using a unique salt and repeated hashing.
async function derive(password, salt, iterations) {
  return bytesToHex(await pbkdf2Async(sha256, password, hexToBytes(salt), {
    c: iterations, dkLen: 32,
  }));
}

export async function createPassword(password) {
  const salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
  return { salt, iterations: ITERATIONS, passwordHash: await derive(password, salt, ITERATIONS) };
}

export async function verifyPassword(password, stored) {
  const hash = await derive(password, stored.salt, stored.iterations);
  if (hash.length !== stored.passwordHash.length) return false;
  let difference = 0;
  for (let i = 0; i < hash.length; i++) {
    difference |= hash.charCodeAt(i) ^ stored.passwordHash.charCodeAt(i);
  }
  return difference === 0;
}
