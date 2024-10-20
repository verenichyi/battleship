import { Room } from "../models/interfaces";

export class PlayersDb {
    constructor(public rooms: Room[] = []) {
    }

    // ******************************************************* PLAYER ******************
    public findOne(id: number | string): Room | null {
        return this.rooms.find((room: Room) => room.roomId === id) || null;
    }
    //
    // public createPlayer(player: Player): Player {
    //     this.rooms.push(player);
    //     return player;
    // }

    // public update(userData: IUserSchema): IUserSchema | null {
    //     const candidate = this.getOne(userData.id);
    //     if (!candidate) {
    //         return null;
    //     }
    //
    //     this.users.forEach((user: IUserSchema) => {
    //         if (user.id === userData.id) {
    //             Object.keys(user).forEach((key) => {
    //                 user[key] = userData[key];
    //             });
    //         }
    //     });
    //
    //     return userData;
    // }
    //
    // public delete(id: string): IUserSchema | null {
    //     const candidate = this.getOne(id);
    //     if (!candidate) {
    //         return null;
    //     }
    //
    //     let result;
    //     this.users.forEach((user: IUserSchema, index) => {
    //         if (user.id === id) {
    //             result = this.users.splice(index, 1);
    //         }
    //     });
    //
    //     return result;
    // }
}

export default PlayersDb;