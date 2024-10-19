import { Message } from "../models/interfaces";
import { MessageData } from "../models/types";

export const parseWsRequestMessage = (message: string): Message<MessageData> => {
    const parsedMessage = JSON.parse(message);
    return  { ...parsedMessage, data: JSON.parse(parsedMessage.data)}
}

export const parseWsResponseMessage = (message: Message<MessageData>): string => {
    return JSON.stringify({...message, data: JSON.stringify(message.data)});
}