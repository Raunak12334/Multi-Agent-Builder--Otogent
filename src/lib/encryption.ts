import Cryptr from "cryptr";

let cryptr: Cryptr | null = null;

const getCryptr = () => {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is required for encryption operations",
    );
  }

  if (!cryptr) {
    cryptr = new Cryptr(encryptionKey);
  }

  return cryptr;
};

export const encrypt = (text: string) => {
  if (!text) return text;
  return getCryptr().encrypt(text);
};

export const decrypt = (text: string) => {
  if (!text) return text;
  try {
    return getCryptr().decrypt(text);
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
