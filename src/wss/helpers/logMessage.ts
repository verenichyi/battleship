import { MessageData } from '../models/types';
import { Message } from "../models/interfaces";

export const logMessage = (type: 'res' | 'req', data: Message<MessageData> | string): void => {
  const mes =
    type === 'req' ? '\x1b[43m Request from client: \x1b[0m' : '\x1b[42m Response from server: \x1b[0m';
  console.log(mes);
  console.log(data, '\n');
};

export const logError = (text: string): void => {
  console.error(`\x1b[31m ${text} \x1b[0m`)
}
