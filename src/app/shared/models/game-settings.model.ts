import { Unit } from "./unit-class.model";

export class GameSettings extends Unit {
    public id: string;
    public userEmail: string;
    public words: string[];

    constructor(id: string,userEmail:string,words:string[]) {
        super();
        this.id = id;
        this.userEmail = userEmail;
        this.words = words;
    }
}
