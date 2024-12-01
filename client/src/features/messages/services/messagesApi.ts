import axios from 'axios';

import type { FetchMessageRequestData, FetchMessageResponseData } from '../../../../../shared/types/api/messages';

const apiEndpoint = `${import.meta.env.VITE_SERVER_HOST}/api/messages`;

const fetchMessaes = async (roomId: string, limit: number, offset: number) => {
  try {
    const { data } = await axios.post<FetchMessageResponseData>(
      `${apiEndpoint}/fetch-messages-from-chat`,
      { chatId: roomId, limit, offset } as FetchMessageRequestData,
      { withCredentials: true },
    );
    return data.messages;
  } catch (err) {
    return {
      messages: [],
    };
  }
};

export { fetchMessaes };
