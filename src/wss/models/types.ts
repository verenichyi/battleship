import {
    AddShipsRequestData,
    AddUserToRoomRequestData,
    CreateGameResponseData,
    RegRequestData,
    RegResponseData, StartGameResponseData, TurnResponseData,
    UpdateRoomResponseDataItem,
    UpdateWinnersResponseDataItem
} from "./interfaces";

export type MessageData =
    | RegRequestData
    | RegResponseData
    | AddUserToRoomRequestData
    | CreateGameResponseData
    | UpdateWinnersResponseDataItem[]
    | UpdateRoomResponseDataItem[]
    | AddShipsRequestData
    | StartGameResponseData
    | TurnResponseData;