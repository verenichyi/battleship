import { Player } from "../models/interfaces";

export class PlayersDb {
    constructor(public players: Player[] = []) {
    }

    // ******************************************************* PLAYER ******************
    public findOne(name: string): Player | null {
        return this.players.find((player: Player) => player.name === name) || null;
    }

    public create(player: Player): Player {
        this.players.push(player);
        return player;
    }

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