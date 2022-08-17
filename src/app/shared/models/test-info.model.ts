import { Unit } from "./unit-class.model";

export class TestInfo extends Unit {
    public id:string;
    public userEmail:string;
    public wordList:string[];
    public createDateOfTest: Date;
    public isPlayed: boolean;

    constructor(id: string, userEmail: string, wordList:string[]) {
        super();
        this.isPlayed = false;
        this.createDateOfTest = new Date();
        this.id=id;
        this.userEmail=userEmail;
        this.wordList=wordList;
    }
}
