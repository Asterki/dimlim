const MessageComponent = () => {
  return (
    <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
      <div>This is a test message</div>
      <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
    </div>
  );
};

export default MessageComponent;
