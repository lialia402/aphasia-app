import { Unit } from "./unit-class.model";

export class GameResult extends Unit{
    public userEmail: string; 
    public categoryID: string; 
    public right: number; 
    public wrong: number; 
    public id: string;

    constructor(userEmail: string, categoryID: string,right:number,wrong:number,) {
        super();
        this.wrong = wrong;
        this.right = right;
        this.categoryID = categoryID;
        this.userEmail = userEmail;
    }


    
}
