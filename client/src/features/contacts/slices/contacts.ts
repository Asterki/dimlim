import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '../../../../../shared/types/models';

interface ContactsState {
  contacts: Contact[];
}

const initialState: ContactsState = {
  contacts: []
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
  },
});

export const { setContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
