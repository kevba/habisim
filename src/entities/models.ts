export interface Entity {
    zIndex: number
    name: string

    render: (coords: Coords, scale: number, context: CanvasRenderingContext2D) => void
}

export class Coords {
    constructor(public x: number, public y: number) {}

    static from(hash: string) {
        const c = hash.split('-')
        return new Coords(Number(c[0]), Number(c[1]))
    }

    hash(): string {
        return `${this.x}-${this.y}`
    }
    
}
