import { RegRequestData } from "../models/interfaces";
import { MessageData } from "../models/types";

export const isRegRequestData = (data: any): data is RegRequestData => {
    const messageData = data as RegRequestData;
    return messageData.name && typeof messageData.name === 'string' &&
        messageData.password && typeof messageData.password === 'string';
};