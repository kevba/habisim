import { Coords } from "./models"

export enum EntityActionTypes {
    Remove = 'remove',
    Continue = 'continue',
    Move = 'move'
}

export type EntityAction = {
    type: EntityActionTypes.Remove,
    priority: number,
} | {
    type: EntityActionTypes.Continue
    priority: number,
} | {
    type: EntityActionTypes.Move,
    priority: number,
    coords: Coords
}
