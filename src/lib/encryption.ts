import Cryptr from "cryptr";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY && process.env.NODE_ENV === "production") {
  console.error(
    "CRITICAL: ENCRYPTION_KEY is not set in production. Credentials will fail to decrypt.",
  );
}

const cryptr = new Cryptr(ENCRYPTION_KEY || "placeholder-key-for-build");

export const encrypt = (text: string) => {
  if (!text) return text;
  return cryptr.encrypt(text);
};

export const decrypt = (text: string) => {
  if (!text) return text;
  try {
    return cryptr.decrypt(text);
  } catch (error) {
    console.error(
      "Decryption failed. This usually means the ENCRYPTION_KEY has changed or is incorrect.",
      error,
    );
    throw new Error(
      "Failed to decrypt sensitive data. Please check your ENCRYPTION_KEY.",
    );
  }
};
