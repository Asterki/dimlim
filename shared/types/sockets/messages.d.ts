import { EncryptedMessage } from '../models';

export interface MessagesPrivateSendData {
  message: EncryptedMessage;
}

export interface MessagePrivateSendResponse {
  status: 'sent' | 'delivered' | 'error';
  messageID: string;
}
