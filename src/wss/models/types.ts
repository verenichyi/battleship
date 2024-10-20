import { AddUserToRoomRequestData, CreateGameResponseData, RegRequestData, RegResponseData } from "./interfaces";

export type MessageData =
    | RegRequestData
    | RegResponseData
    | AddUserToRoomRequestData
    | CreateGameResponseData;