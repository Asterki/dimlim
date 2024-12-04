import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import PageLayout from '../../layouts/PageLayout';

import { useAuth } from '../../features/auth';
import { useContacts } from '../../features/contacts';
import { eventListener, useMessages } from '../../features/private-messages';
import useNotification from '../../hooks/useNotification';

import { EncryptedMessage, Message } from '../../../../shared/types/models';
import MessageComponent from '../../features/private-messages/components/MessageComponent';

import { RoomsPrivateJoinResponse, RoomsPrivateLeaveResponse } from '../../../../shared/types/sockets/rooms';
import { MessagePrivateSendResponse } from '../../../../shared/types/sockets/messages';

const ChatIndex = () => {
  const { user, authStatus, getPrivateKey } = useAuth();
  const { notification, showNotification } = useNotification();
  const { getContactProfile, getContactPubKey } = useContacts();
  const { currentMessages, sendMessage, joinPrivateChat, leavePrivateChat, addMessage, decryptMessage } = useMessages();

  const redirect = useNavigate();
  const { user_id: contactID } = useParams();

  const [contact, setContact] = React.useState<{
    userID: string;
    profile: {
      username: string;
      avatar: string;
      imageID: string;
      website: string;
      bio: string;
    };
  } | null>(null);

  const [roomID, setRoomID] = React.useState<string | null>(null);
  const [contactPubKey, setContactPubKey] = React.useState<string | null>(null);

  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [isConnectedToRoom, setIsConnectedToRoom] = React.useState<boolean>(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const messageChatRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contactID === undefined) return redirect('/home');
    if (authStatus !== 'authenticated') return;

    (async () => {
      // Fetch contact
      const result = await getContactProfile(contactID);
      if (result === null) return redirect('/home');
      if (result.status !== 'success') return redirect('/home'); // TODO: Handle for blocked etc
      setContact(result.contact!);

      const roomName = await joinPrivateChat(user!.userID, result.contact!.userID);
      setRoomID(roomName);

      // Fetch contact's public key
      const pubKey = await getContactPubKey(result.contact!.userID);
      if (!pubKey) return redirect('/home');

      setContactPubKey(pubKey);
    })();

    const handleRoomJoin = (data: RoomsPrivateJoinResponse) => {
      console.log('Joined room:', data);
      setIsConnectedToRoom(true);
    };

    const handleRoomLeave = (data: RoomsPrivateLeaveResponse) => {
      console.log('Left room:', data);
      setIsConnectedToRoom(false);
    };

    eventListener.subscribe('rooms-private-join', handleRoomJoin);
    eventListener.subscribe('rooms-private-leave', handleRoomLeave);

    eventListener.subscribe('messages-private-new', async (data: { message: EncryptedMessage }) => {
      if (data.message.recipientId !== user!.userID) return; // Only decrypt messages meant for the current user
      const decryptedMessage = decryptMessage(data.message, (await getPrivateKey()) as string);
      if (!decryptedMessage) return;
      addMessage(decryptedMessage);
    });

    eventListener.subscribe('messages-private-send', async (data: MessagePrivateSendResponse) => {
      console.log(data);
    });

    return () => {
      if (roomID) {
        leavePrivateChat(contactID);
        eventListener.unsubscribe('rooms-private-join', handleRoomJoin);
        eventListener.unsubscribe('rooms-private-leave', handleRoomLeave);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  React.useEffect(() => {
    console.log('Messages:', currentMessages);
    // Scroll to bottom of messages

    if (messageChatRef.current) {
      messageChatRef.current.scrollTop = messageChatRef.current.scrollHeight;
    }
  }, [currentMessages]);

  React.useEffect(() => {}, []);

  const sendMessageButtonClicked = () => {
    if (!inputRef.current?.value) return showNotification('Error', 'Message cannot be empty', 'error');
    if (!roomID || !contactPubKey) return showNotification('Error', 'An error occurred', 'error');

    const message: Message = {
      id: uuidv4(),
      senderId: user!.userID,
      recipientId: contact!.userID,
      offset: 0, // This really doesn't matter
      content: inputRef.current!.value,
      createdAt: new Date(Date.now()),
      isRead: false,
      updatedAt: new Date(Date.now()),
      attachments: [],
      editHistory: [],
      reactions: [],
    };

    if (isConnectedToRoom) {
      sendMessage(contactPubKey!, message); // This automatically adds the message to the currentMessages state and to indexedDB
    } else {
      // Store the message in indexedDB and send it when connected to the room
    }
    inputRef.current!.value = '';
  };

  return (
    <PageLayout
      notification={notification}
      requiresLogin={true}
      className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}
    >
      {user && authStatus == 'authenticated' && contact && (
        <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'>
          <div className='py-20 flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 justify-center md:w-7/12 w-11/12 h-[calc(100vh-7rem)]'>
              <div className=' dark:bg-gray-700 bg-slate-100 rounded-md shadow-md p-4'>
                <div className='flex items-center'>
                  <img src={`https://placehold.co/300`} alt='avatar' className='w-8 h-8 rounded-full' />
                  <h1 className='ml-2 text-lg font-semibold'>{contact.profile.username}</h1>
                </div>
              </div>

              <div className='mt-2 rounded-md shadow-md p-4 dark:bg-gray-700 bg-slate-100 h-[calc(100%-3rem)] relative'>
                <div
                  ref={messageChatRef}
                  className='flex flex-col gap-2 overflow-y-scroll pb-4 h-[calc(100%-3.5rem)] px-4'
                >
                  {currentMessages.map((message) => (
                    <MessageComponent messageStatus='sent' key={message.id} message={message} userID={user.userID} />
                  ))}
                </div>

                <div className='flex items-center w-full justify-center gap-2'>
                  <input
                    type='text'
                    ref={inputRef}
                    className='w-full rounded-md p-2 dark:bg-gray-800 bg-slate-200 outline-none border-2 dark:border-gray-800 transition-all border-slate-200 dark:focus:border-blue-400'
                    placeholder='Type a message...'
                  />
                  <button className='bg-blue-400 rounded-md p-2 w-2/12 text-white' onClick={sendMessageButtonClicked}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ChatIndex;
