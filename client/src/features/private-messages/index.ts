// import messagesReducer from './slices/messageSlice';
// import messagesApi from './services/messagesApi';
import messagesSocket from './services/socket';
import useMessages from './hooks/useMessages';
import useMessageListener from './hooks/useMessageListener';

messagesSocket.connect();

export { messagesSocket, useMessages, useMessageListener };
