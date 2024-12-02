import { useEffect, useRef } from 'react';
import { Message } from '../../../../../shared/types/models';
import { useMessages } from '..';


const useMessageListener = (privKey: string, callback: (message: Message) => void) => {
    const { onMessage } = useMessages()
    const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      callbackRef.current(message);
    };

    onMessage(privKey, handleMessage);

    return () => {
      // Unsubscribe logic if needed
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privKey]);
};

export default useMessageListener;