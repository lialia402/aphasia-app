import { Unit } from "./unit-class.model";

export class GameInfo extends Unit{
    public gameNum: number;
    public isPlayed: boolean;
    public totalScore: number
    public numOfPlayed: number
    public listOfWords: string[];
    public createDateOfGame: Date;

    constructor(gameNum: number, listOfWords: string[], date:Date) {
        super();
        this.isPlayed = false;
        this.totalScore = 0;
        this.numOfPlayed = 0;
        this.gameNum = gameNum;
        this.listOfWords = listOfWords;
        this.createDateOfGame = date;
    }
}
