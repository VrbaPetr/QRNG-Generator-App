// app/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// Use a separate encryption key from your JWT signing key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export function encrypt(text: string): string {
  // Create an initialization vector
  const iv = randomBytes(16);

  // Create cipher
  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY ?? ""),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV and encrypted data
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  // Extract IV and encrypted data
  const [ivHex, encryptedData] = encryptedText.split(":");

  // Create decipher
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY ?? ""),
    Buffer.from(ivHex, "hex")
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
