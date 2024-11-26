import axios from 'axios';

import { useAuth } from '../../features/auth';

import { generateAESKey, encryptWithAES, decryptKeyWithRSA, decryptWithAES, encryptKeyWithRSA } from '../../utils/crypto';

const TestPage = () => {
  const { user, privKey } = useAuth();

  const test = async () => {
    if (!user || !privKey) return;

    const pubKey = user.pubKey;

    const largeMessage = 'This is a very large message that needs encryption.'.repeat(100);
    console.log('Original Message:', largeMessage);

    const aesKey = generateAESKey();
    const aesResult = encryptWithAES(largeMessage, aesKey);

    // Step 2: Encrypt the AES key with RSA
    const encryptedAESKey = encryptKeyWithRSA(aesKey, pubKey);

    console.log('\nEncrypted AES Key (Base64):', encryptedAESKey);
    console.log('\nEncrypted Message (AES, Base64):', aesResult.ciphertext);

    // Step 3: Decrypt the AES key with RSA
    const decryptedAESKey = decryptKeyWithRSA(encryptedAESKey, privKey);

    // Step 4: Decrypt the message with AES
    const decryptedMessage = decryptWithAES(aesResult.ciphertext, decryptedAESKey, aesResult.iv);

    console.log('\nDecrypted Message:', decryptedMessage);
  };

  return (
    <div>
      <p>
        This page will be used to conduct random tests using the current's app state, this should not be accessible in
        production.
      </p>

      <main>
        <button className='btn' onClick={test}>
          Test
        </button>
      </main>
    </div>
  );
};

export default TestPage;
