export class Ship {
    length: number;
    damages: number;
    id: number;

    constructor(length: number, id: number) {
        this.length = length;
        this.id = id;
        this.damages = 0;
    }

    addDamage(): number | null {
        this.damages += 1;

        if (this.damages === this.length) {
            return this.id;
        }

        return null;
    }
}
