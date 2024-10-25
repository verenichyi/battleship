export class Ship {
  private damages: number = 0;

  constructor(
    public length: number,
    private id: number,
  ) {}

  addDamage(): number | null {
    this.damages += 1;

    if (this.damages === this.length) {
      return this.id;
    }

    return null;
  }
}
