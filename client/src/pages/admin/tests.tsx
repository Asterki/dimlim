import axios from 'axios';

const TestPage = () => {
  const test = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/crypto/generateKeys', {
        withCredentials: true,
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
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
