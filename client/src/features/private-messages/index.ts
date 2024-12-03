// import messagesReducer from './slices/messageSlice';
// import messagesApi from './services/messagesApi';
import messagesSocket from './services/socket';
import useMessages from './hooks/useMessages';
import eventListener from './services/eventListener';

messagesSocket.connect();

export { messagesSocket, useMessages, eventListener };
