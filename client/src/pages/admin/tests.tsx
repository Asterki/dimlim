import axios from 'axios';

import { useAuth } from '../../features/auth';

const TestPage = () => {
  const { user, privKey } = useAuth();

  const test = async () => {
    console.log(user);
    console.log(privKey);
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
