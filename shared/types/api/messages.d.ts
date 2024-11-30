import { EncryptedMessage } from '../models';

export interface FetchMessageRequestData {
  chatId: string;
  limit: number;
  offset: number;
}
export interface FetchMessageResponseData {
  status: string;
  messages?: EncryptedMessage[];
}
