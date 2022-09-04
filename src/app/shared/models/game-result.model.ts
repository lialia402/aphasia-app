import { Unit } from "./unit-class.model";

export class GameResult extends Unit{
    public userEmail: string; 
    public categoryID: string; 
    public rightCustom: Date[]; 
    public wrongCustom: Date[]; 
    public rightRandom: Date[]; 
    public wrongRandom: Date[]; 
    public id: string;

    constructor(userEmail: string, categoryID: string, id:string) {
        super();
        this.categoryID = categoryID;
        this.userEmail = userEmail;
        this.rightCustom = [];
        this.wrongCustom = [];
        this.rightRandom = [];
        this.wrongRandom = [];
    }
}
