import { EncryptedMessage } from '../models';

export interface MessagesPrivateSendData {
  message: EncryptedMessage;
  contactID: string;
}

export interface MessagePrivateSendResponse {
  status: 'sent' | 'delivered' | 'error';
  messageID: string;
}
