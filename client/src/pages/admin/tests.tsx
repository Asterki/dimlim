import axios from 'axios';

import { useAuth } from '../../features/auth';

import { encryptMessage, decryptMessage } from "../../utils/crypto"

const TestPage = () => {
  const { user, privKey } = useAuth();

  const test = async () => {
    if (!user || !privKey) return;

    const message = 'Hello, world!';
    const encryptedMessage = encryptMessage(message, user.pubKey);

    console.log(encryptedMessage);

    const decryptedMessage = decryptMessage(encryptedMessage, privKey);
    console.log(decryptedMessage);
    
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
