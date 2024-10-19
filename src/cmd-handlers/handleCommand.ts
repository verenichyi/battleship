import { Duplex } from "node:stream";
import { handleRegistration } from "./handleRegistration";
import { Message, RegRequestData } from "../models/interfaces";
import { MessageData } from "../models/types";
import { MessageTypes } from "../enums/messageTypes";

export const handleCommand = (ws: Duplex, message: Message<MessageData>): void => {
    const { type, data, id } = message;
    switch (type) {
        case MessageTypes.REG:
            handleRegistration(ws, data as RegRequestData, id);
            break;
    }
}