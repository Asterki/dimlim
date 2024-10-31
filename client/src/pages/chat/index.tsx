import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '../../layouts/PageLayout';

import { useAuth } from '../../features/auth';
import useNotification from '../../hooks/useNotification';

import { GetResponseData } from '../../../../shared/types/api/contacts';

const ChatIndex = () => {
  const { user, authStatus } = useAuth();
  const { notification, showNotification } = useNotification();

  const redirect = useNavigate();
  const { userid: userID } = useParams();

  const [contact, setContact] = React.useState<{
    profile: {
      username: string;
    };
    userID: string;
  } | null>(null);

  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (authStatus !== 'authenticated') return;

    (async () => {
      // Fetch contact
      const response = await axios.get<GetResponseData>(`${import.meta.env.VITE_SERVER_HOST}/api/contacts/get`, {
        withCredentials: true,
      });
      if (response.data.status === 'success' && response.data.contacts) {
        const currentContact = response.data.contacts.accepted.find((contact) => contact.userID === userID);
        if (currentContact) setContact(currentContact);
        else redirect('/contacts');
      }
    })();
  }, [authStatus, redirect, userID]);

  React.useEffect(() => {
    if (contact !== null) {
      const newSocket = io(import.meta.env.VITE_SERVER_HOST, {
        withCredentials: true,
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        setSocket(newSocket);

        newSocket.emit('messageewq', {
          to: 'jewioqejoqiwe',
          message: 'Hello',
        });
      });
    }
  }, [contact]);

  const a = () => {
    if (socket && socket.connected) {
      console.log('weqewqeqw');
      socket.emit('messageewq', {
        to: 'jewioqejoqiwe',
        message: 'Hello',
      });
    }
  };

  return (
    <PageLayout
      notification={notification}
      requiresLogin={true}
      className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'
    >
      {user && contact && (
        <div>
          <div className='pt-20 flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 justify-center md:w-7/12 w-11/12 h-[calc(100vh-7rem)]'>
              <div className=' dark:bg-gray-700 bg-slate-100 rounded-md shadow-md p-4'>
                <div className='flex items-center'>
                  <img
                    src={`https://avatars.dicebear.com/api/avataaars/${contact.userID}.svg`}
                    alt='avatar'
                    className='w-8 h-8 rounded-full'
                  />
                  <h1 className='ml-2 text-lg font-semibold'>{contact.profile.username}</h1>
                </div>
              </div>

              <div className='mt-2 rounded-md shadow-md p-4 dark:bg-gray-700 bg-slate-100 h-[calc(100%-3rem)] relative'>
                <div className='flex flex-col gap-2 overflow-y-scroll pb-4 max-h-[calc(100%-3.5rem)] px-4 shadow-md'>
                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-slate-500 w-max max-w-xl text-white p-2 my-2'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>

                  <div className=' shadow-md rounded-md bg-blue-400 w-max max-w-xl text-white p-2 my-2 ml-auto text-right'>
                    <div>This is a test message</div>
                    <div className='text-sm text-white/50'>{new Date(Date.now()).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className='flex items-center justify-center absolute bottom-4'>
                  <input
                    type='text'
                    className='w-full rounded-md p-2 dark:bg-gray-800 bg-slate-200 outline-none border-2 focus:border-blue-400'
                    placeholder='Type a message...'
                  />
                  <button className='bg-blue-400 rounded-md p-2 ml-2 w-2/12 text-white' onClick={a}>
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
