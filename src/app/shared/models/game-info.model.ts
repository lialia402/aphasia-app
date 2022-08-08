import { Unit } from "./unit-class.model";

export class GameInfo extends Unit{
    public gameNum: number;
    public isPlayed: boolean;
    public totalScore: number
    public numOfPlayed: number
    public listOfWords: string[];

    constructor(gameNum: number, listOfWords: string[]) {
        super();
        this.isPlayed = false;
        this.totalScore = 0;
        this.numOfPlayed = 0;
        this.gameNum = gameNum;
        this.listOfWords = listOfWords;
    }
}
