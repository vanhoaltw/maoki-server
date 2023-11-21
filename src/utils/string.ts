import crypto from "crypto";

const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
export const encryptString = (text: string) => {
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    secretKey,
    "qwertyuiopasdfgh"
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
