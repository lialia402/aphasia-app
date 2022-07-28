import { Unit } from "./unit-class.model";

export class Game extends Unit{
    public id: string;
    public right: number;
    public dateOfGame: Date;
    public userEmail: string;

    constructor(id: string, right: number,userEmail:string,dateOfGame:Date) {
        super();
        this.id = id;
        this.right = right;
        this.userEmail = userEmail;
        this.dateOfGame = dateOfGame;
    }
}
