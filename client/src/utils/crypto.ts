import forge from 'node-forge';

const generateKeyPair = () => {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
  return { privateKey: privateKeyPem, publicKey: publicKeyPem };
};

const encryptMessage = (message: string, publicKeyPem: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(message), 'RSA-OAEP');
  return forge.util.encode64(encrypted);
};

const decryptMessage = (encryptedMessage: string, privateKeyPem: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decodedMessage = forge.util.decode64(encryptedMessage);
  const decrypted = privateKey.decrypt(decodedMessage, 'RSA-OAEP');
  return forge.util.decodeUtf8(decrypted);
};

const signMessage = (message: string, privateKeyPem: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const md = forge.md.sha256.create();
  md.update(message, 'utf8');
  const signature = privateKey.sign(md);
  return forge.util.encode64(signature);
};

const verifySignature = (message: string, signature: string, publicKeyPem: string): boolean => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const md = forge.md.sha256.create();
  md.update(message, 'utf8');
  const decodedSignature = forge.util.decode64(signature);
  return publicKey.verify(md.digest().bytes(), decodedSignature);
};

const hashMessage = (message: string): string => {
  const md = forge.md.sha256.create();
  md.update(message, 'utf8');
  return md.digest().toHex();
};

const deriveKey = (password: string, salt: string): string => {
  const key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);
  return forge.util.encode64(key);
};

const encryptSymmetric = (message: string, key: string): string => {
  const cipher = forge.cipher.createCipher('AES-CBC', forge.util.decode64(key));
  const iv = forge.random.getBytesSync(16);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(message, 'utf8'));
  cipher.finish();
  const encrypted = cipher.output.getBytes();
  return forge.util.encode64(iv + encrypted);
};

const decryptSymmetric = (encryptedMessage: string, key: string): string => {
  const decodedMessage = forge.util.decode64(encryptedMessage);
  const iv = decodedMessage.slice(0, 16);
  const encrypted = decodedMessage.slice(16);
  const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.decode64(key));
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encrypted));
  decipher.finish();
  return decipher.output.toString();
};

export {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifySignature,
  hashMessage,
  deriveKey,
  encryptSymmetric,
  decryptSymmetric,
};