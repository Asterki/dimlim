import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMessagesApi, sendMessageApi, deleteMessageApi, updateMessageApi } from '../services/messageApi';
import { Message } from '../../../../../shared/types/models';

// Define the initial state
interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
};

// Async thunks for fetching, sending, deleting, and updating messages
export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
  const response = await fetchMessagesApi();
  return response;
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async (message: Message) => {
  const response = await sendMessageApi(message);
  return response;
});

export const deleteMessage = createAsyncThunk('messages/deleteMessage', async (messageId: string) => {
  await deleteMessageApi(messageId);
  return messageId;
});

export const updateMessage = createAsyncThunk('messages/updateMessage', async (message: Message) => {
  const response = await updateMessageApi(message);
  return response;
});

// Create the slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex((message) => message.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.messages = state.messages.filter((message) => message.id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete message';
      })
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        const index = state.messages.findIndex((message) => message.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update message';
      });
  },
});

// Export actions and reducer
export const { addMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
