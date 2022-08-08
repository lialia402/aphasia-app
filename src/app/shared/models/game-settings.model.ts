import { GameInfo } from "./game-info.model";
import { Unit } from "./unit-class.model";

export class GameSettings extends Unit {
    public id: string;
    public userEmail: string;
    public enableRandomGame: boolean;
    public listOfGames: GameInfo[];

    constructor(id: string,userEmail:string,enableRandomGame:boolean,listOfGames:GameInfo[]) {
        super();
        this.id = id;
        this.userEmail = userEmail;
        this.listOfGames = listOfGames;
        this.enableRandomGame = enableRandomGame;
    }
}
