import forge from 'node-forge';

const generateKeyPair = () => {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
  return { privateKey: privateKeyPem, publicKey: publicKeyPem };
};

// Generate a random AES key
const generateAESKey = () => {
  return forge.random.getBytesSync(32); // 256-bit AES key
};

// Encrypt large data with AES
const encryptWithAES = (data: string, key: string) => {
  const iv = forge.random.getBytesSync(16); // 128-bit IV
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data, 'utf8'));
  cipher.finish();
  return {
    ciphertext: forge.util.encode64(cipher.output.getBytes()),
    iv: forge.util.encode64(iv),
  };
};

// Decrypt AES-encrypted data
const decryptWithAES = (encryptedData: string, key: string, ivBase64: string) => {
  const iv = forge.util.decode64(ivBase64);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
  decipher.finish();
  return decipher.output.toString();
};

// RSA-OAEP for key encryption
const encryptKeyWithRSA = (key: string, publicKeyPem: string) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedKey = publicKey.encrypt(key, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });
  return forge.util.encode64(encryptedKey);
};

const decryptKeyWithRSA = (encryptedKeyBase64: string, privateKeyPem: string) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedKey = forge.util.decode64(encryptedKeyBase64);
  const decryptedKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });
  return decryptedKey;
};

export {
  generateKeyPair,
  generateAESKey,
  encryptWithAES,
  decryptWithAES,
  encryptKeyWithRSA,
  decryptKeyWithRSA,
};