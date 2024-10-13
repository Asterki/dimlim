import React from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import { FaPencilAlt } from 'react-icons/fa';
import { FaSave } from 'react-icons/fa';
import { User } from '../../../../shared/types/models';

interface SectionProps {
  page: React.RefObject<HTMLDivElement>;
  user: User;
}

const SettingsProfileSection: React.FC<SectionProps> = (props) => {
  const [profilePictureModalOpen, setProfilePictureModalOpen] = React.useState(false);
  const profilePictureInput = React.useRef<HTMLInputElement>(null);

  const [updatingBio, setUpdatingBio] = React.useState(false);
  const bioInput = React.useRef<HTMLInputElement>(null);

  const [updatingWebsite, setUpdatingWebsite] = React.useState(false);
  const websiteInput = React.useRef<HTMLInputElement>(null);

  return (
    <div>
      <input type='file' className='hidden' ref={profilePictureInput} />

      <Dialog.Root open={profilePictureModalOpen} onOpenChange={(state) => setProfilePictureModalOpen(state)}>
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
          <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-gray-700 bg-slate-200 text-slate-700 p-4 dark:text-white focus:outline-none z-30 flex flex-col items-center'>
            <img src='https://placehold.co/400' alt='' className='rounded-full w-64 transition-all' />

            <button
              className='mt-2 rounded-md bg-blue-400 text-white w-full p-2'
              onClick={() => {
                profilePictureInput.current!.click();
              }}
            >
              Change Profile Picture
            </button>

            <button
              className='mt-2 rounded-md bg-slate-400 text-white w-full p-2'
              onClick={() => {
                setProfilePictureModalOpen(false);
              }}
            >
              Close
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className='flex items-center p-4 gap-4'>
        <div
          className='group relative rounded-full cursor-pointer'
          onClick={() => {
            profilePictureInput.current!.click();
          }}
        >
          <img
            src='https://placehold.co/400'
            alt=''
            className='rounded-full w-64 md:w-32 group-hover:brightness-75 transition-all'
          />
          <FaPencilAlt className='opacity-0 transition-all group-hover:opacity-100 text-2xl absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]' />
        </div>
        <div className='flex flex-col items-start'>
          <h1 className='text-3xl font-bold'>{props.user.profile.username}</h1>
          <div
            className='group flex items-center gap-2 cursor-pointer'
            onClick={() => {
              if (!updatingBio) {
                setUpdatingBio(true);
                bioInput.current?.focus();
              }
            }}
          >
            <p className={updatingBio ? 'hidden' : 'block'}>{props.user.profile.bio || 'No bio'}</p>
            <input
              type='text'
              ref={bioInput}
              defaultValue={props.user.profile.bio}
              placeholder='Write your bio'
              className={`${
                updatingBio ? 'block' : 'hidden'
              } p-2 dark:bg-gray-800 border-2 dark:border-gray-600 border-slate-200  outline-none rounded-md transition-all focus:!border-blue-400 hover:border-slate-300 dark:hover:border-gray-500`}
            />
            {updatingBio ? (
              <FaSave
                onClick={() => {
                  setUpdatingBio(false);
                }}
                className='opacity-0 group-hover:opacity-100 text-xl transition-all'
              />
            ) : (
              <FaPencilAlt className='opacity-0 group-hover:opacity-100 text-xl transition-all' />
            )}
          </div>
          <div
            className='group flex items-center gap-2 cursor-pointer'
            onClick={() => {
              if (!updatingWebsite) {
                setUpdatingWebsite(true);
                websiteInput.current?.focus();
              }
            }}
          >
            <p
              className={`${
                updatingWebsite ? 'hidden' : 'block'
              } text-blue-400 hover:text-purple-400 transition-all cursor-pointer`}
            >
              {props.user.profile.bio || 'No website'}
            </p>
            <input
              type='text'
              ref={websiteInput}
              defaultValue={props.user.profile.website}
              placeholder='www.example.com'
              className={`${
                updatingWebsite ? 'block' : 'hidden'
              } p-2 dark:bg-gray-800 border-2 dark:border-gray-600 border-slate-200  outline-none rounded-md transition-all focus:!border-blue-400 hover:border-slate-300 dark:hover:border-gray-500"`}
            />
            {updatingWebsite ? (
              <FaSave
                onClick={() => {
                  setUpdatingWebsite(false);
                }}
                className='opacity-0 group-hover:opacity-100 text-xl transition-all'
              />
            ) : (
              <FaPencilAlt className='opacity-0 group-hover:opacity-100 text-xl transition-all' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfileSection;
