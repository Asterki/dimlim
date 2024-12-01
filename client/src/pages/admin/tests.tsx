import axios from 'axios';

import { useAuth } from '../../features/auth';

const TestPage = () => {
  const { user, privKey } = useAuth();

  const test = async () => {
    const response = await axios.post(
      'http://localhost:3000/api/messages/fetch-messages-from-chat',
      {
        chatId: '74aaf945-17c2-4ad9-9555-0e46857abb25-f4c3566c-bbcf-4376-a785-0b1949e2b774',
        limit: 50,
        offset: 0,
      },
      {
        withCredentials: true,
      },
    );

    console.log(response);
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
