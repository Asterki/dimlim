// import messagesReducer from './slices/messageSlice';
// import messagesApi from './services/messagesApi';
import messagesSocket from './services/messagesSocket';
import useMessages from './hooks/useMessages';

messagesSocket.connect();

export { messagesSocket, useMessages };
