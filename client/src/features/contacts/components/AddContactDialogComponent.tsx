import React, { useRef } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import DialogComponent from '../../../components/DialogComponent';

interface AddContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ open, onClose, onSubmit }) => {
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const username = usernameRef.current!.value.toLowerCase();
    onSubmit(username);
  };

  return (
    <DialogComponent open={open} onClose={onClose} title='Add Contact'>
      <div className='flex items-center flex-col gap-2'>
        <h1 className='text-2xl flex flex-col items-center'>
          <HiOutlineUserCircle className='inline-block' />
          <p className='text-center'>Enter the username of the user you want to add</p>
        </h1>
        <input
          className='dark:bg-gray-800 bg-slate-200 rounded-md p-2 dark:text-white w-full'
          placeholder='Username'
          ref={usernameRef}
        />
        <button className='p-2 bg-blue-400 rounded-md mt-2 w-1/2 text-white' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </DialogComponent>
  );
};

export default AddContactDialog;
