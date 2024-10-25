import {
  AddShipsRequestData,
  AddUserToRoomRequestData,
  AttackRequestData,
  AttackResponseData,
  CreateGameResponseData,
  FinishData,
  RegRequestData,
  RegResponseData,
  StartGameResponseData,
  TurnResponseData,
  UpdateRoomResponseDataItem,
  UpdateWinnersResponseDataItem,
} from './interfaces';

export type MessageData =
  | RegRequestData
  | RegResponseData
  | AddUserToRoomRequestData
  | CreateGameResponseData
  | UpdateWinnersResponseDataItem[]
  | UpdateRoomResponseDataItem[]
  | AddShipsRequestData
  | StartGameResponseData
  | TurnResponseData
  | AttackRequestData
  | AttackResponseData
  | FinishData;
