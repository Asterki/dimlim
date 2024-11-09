import { useState, useCallback } from 'react';
import forge from 'node-forge';

const useCrypto = () => {
  const [keyPair, setKeyPair] = useState<{ privateKey: string; publicKey: string } | null>(null);

  const generateKeyPair = useCallback(() => {
    const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
    const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
    setKeyPair({ privateKey: privateKeyPem, publicKey: publicKeyPem });
    return { privateKey: privateKeyPem, publicKey: publicKeyPem };
  }, []);

  const signMessage = useCallback((message: string, privateKeyPem: string): string => {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
  }, []);

  const verifySignature = useCallback((message: string, signature: string, publicKeyPem: string): boolean => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const decodedSignature = forge.util.decode64(signature);
    return publicKey.verify(md.digest().bytes(), decodedSignature);
  }, []);

  return {
    keyPair,
    generateKeyPair,
    signMessage,
    verifySignature,
  };
};

export default useCrypto;