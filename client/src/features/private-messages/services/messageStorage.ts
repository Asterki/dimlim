import { get, set, update } from 'idb-keyval';
import { Message } from '../../../../../shared/types/models';

const createChatIfNotExists = async (roomId: string) => {
  if ((await get(`messages-${roomId}-offset`)) == undefined) {
    await set(`messages-${roomId}-offset`, 0); // Create the offset
    await set(`messages-${roomId}-offset-0`, []); // Create the first page
  }
};

const fetchMessaes = async (roomId: string, offset?: number) => {
  await createChatIfNotExists(roomId);

  try {
    if (!offset) offset = (await get<number>(`messages-${roomId}-offset`)) || 0; // Get the latest offset
    const currentOffset = offset;

    const messages = await get<Message[]>(`messages-${roomId}-offset-${currentOffset}`); // Get the messages
    if (!messages) return [];

    // Attach the offset to the messages
    // This is because we need to know which page the messages are in
    // So that we can be able to delete/edit them
    const messagesWithOffset = messages.map((message) => ({ ...message, currentOffset }));
    return messagesWithOffset; // Return the messages
  } catch (err) {
    return [];
  }
};

const createMessage = async (roomId: string, message: Message) => {
  try {
    await createChatIfNotExists(roomId);

    const currentPagination = (await get<number>(`messages-${roomId}-offset`)) || 0; // Get the current pagination
    const messagesInPage = await get<Message[]>(`messages-${roomId}-offset-${currentPagination}`); // Get the messages in the current page
    if (!messagesInPage) return false;

    if (messagesInPage.length >= 50) {
      await update(`messages-${roomId}-offset`, (currentPag) => {
        return (currentPag || 0) + 1;
      }); // Increment the offset
      await set(`messages-${roomId}-offset-${currentPagination + 1}`, [message]); // Create a new page and add the message there
    } else {
      // If the current page is not full, add the message to the current page
      await set(`messages-${roomId}-offset-${currentPagination}`, [...messagesInPage, message]);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deleteMessage = async (roomId: string, messageId: string) => {
  // This is gonna be hell because we have to get of the message from the indexedDB
  // Unless we attach the pagination id to the message, and then we can just delete it
};

export default { fetchMessaes, createMessage };
