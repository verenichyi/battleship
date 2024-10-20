import { AddUserToRoomRequestData, CreateGameResponseData, RegRequestData, RegResponseData, UpdateRoomResponseDataItem, UpdateWinnersResponseDataItem } from "./interfaces";

export type MessageData =
    | RegRequestData
    | RegResponseData
    | AddUserToRoomRequestData
    | CreateGameResponseData
    | UpdateWinnersResponseDataItem[]
    | UpdateRoomResponseDataItem[];