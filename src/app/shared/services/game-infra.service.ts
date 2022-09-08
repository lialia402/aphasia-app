import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { GameInfo } from '../models/game-info.model';
import { GameResult } from '../models/game-result.model';
import { GameSettings } from '../models/game-settings.model';
import { Game } from '../models/game.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})
export class GameInfraService {
  public randomWordList:WordClass[]= [];
  public randomSelectionWords:WordClass[]= [];
  public customWordList:WordClass[]= [];
  public customrandomSelectionWords:WordClass[]= [];
  public finalScoreCurrentGame:number=0;
  public resultGameArray:GameResult[];
  public patientGames:Game[];
  public gameSettings:GameSettings[];
  public customGame = false; 
  public currentCustomGame = -1;
  public gameToEdit:GameInfo = new GameInfo(-1,[], new Date);

  constructor( 
    public categoryInfraService: CategoryInfraService, 
    public wordInfraService: WordInfraService,
    public firebaseInfraService: FirebaseInfraService) {
   }

  // give random category from all user's categories 
  public giveRandomCategory(){
    let randomNumber = Math.floor(Math.random()*this.categoryInfraService.categories.length);
    return this.categoryInfraService.categories[randomNumber];
  }

  // give random word from all user's words 
  public giveRandomWord(words : WordClass[]){
    let randomNumber = Math.floor(Math.random()*words.length);
    return words[randomNumber];
  }

  // Returns the amount of legal words: found in a category that has more than 3 words 
  countValidWords(){
    let count = 0;
    for(let i=0; i<this.categoryInfraService.categories.length;i++)
    {
      let wordsArray = this.filterPerCategory(this.categoryInfraService.categories[i].id);
      if(wordsArray.length > 3)
      {
        count += wordsArray.length;
      }
    }
    return count < 10;
  }

  // filter words per category
  filterPerCategory(categoryID: string){
    let wordsArray = this.categoryInfraService.getAllUserPhrases.filter((word) => {return word.categoryID === categoryID}).sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return wordsArray;
  }

  // return list of words only if the user has more than 10 valid words in the system
  public async checkAndGiveRandomList(){
    if((this.categoryInfraService.getAllUserPhrases.length < 10) || (this.countValidWords()) ){
      return this.randomWordList = [];
    }
    else{
      return this.giveRandomList();
    }
  }

  // return random words list 
  public async giveRandomList(){
    let category;
    let words: WordClass[] = [];
    let word;

    this.randomWordList = [];
    this.randomSelectionWords=[];
    while (this.randomWordList.length < 10) {
      category = this.giveRandomCategory();
     
      let promise= this.wordInfraService.getPhrases(category);
      await promise.then((data) => {
        words = data;
      })

      while(words.length < 4){
        category = this.giveRandomCategory();
        let promise= this.wordInfraService.getPhrases(category);
        await promise.then((data) => {
          words = data;
        })
      }

      word = this.giveRandomWord(words);

      if(this.findWordInArray(word) !== 1)
      {
        this.randomWordList.push(word);
        this.randomSelectionWords.push(word);
        this.pushAnotherThreeWords(word,words,this.randomSelectionWords);
      }
    }

    return this.randomWordList;
  }

  // return words list for custom game
  public giveCustomList(customWords: string[]){
    let category:CategoryClass;
    let words: WordClass[] = [];
    let word:WordClass;

    this.customWordList = [];
    this.customrandomSelectionWords=[];
    let i=0;
    while (this.customWordList.length < 10) {

      word = this.findWordByName(customWords[i]);
  
      const checkCategory = (obj: CategoryClass) => obj.id === word.categoryID;
      category = this.categoryInfraService.categories.find(checkCategory);
      words = this.categoryInfraService.getAllUserPhrases.filter((word) => {return word.categoryID === category.id})

      this.customWordList.push(word);
      this.customrandomSelectionWords.push(word);
      this.pushAnotherThreeWords(word,words,this.customrandomSelectionWords);
      
      i++;
    }
    return this.customWordList;
  }

  // find the given word by the name, and return word object
  findWordByName(wordName: string){
    const findWord = (obj: WordClass) => obj.name === wordName;
    let currentWord = this.categoryInfraService.getAllUserPhrases.find(findWord);
    return currentWord;
  }

  // add 3 words to the list 
  public pushAnotherThreeWords(word:WordClass, words:WordClass[],array:WordClass[]){
    let word1 = this.giveRandomWord(words);
    let word2 = this.giveRandomWord(words);
    let word3 = this.giveRandomWord(words);

    while(word1.id === word.id)
    {
      word1 = this.giveRandomWord(words);
    }

    while(word2.id === word.id || word2.id === word1.id)
    {
      word2 = this.giveRandomWord(words);
    }

    while(word3.id === word.id || word3.id === word1.id || word3.id === word2.id)
    {
      word3 = this.giveRandomWord(words);
    }

    array.push(word1);
    array.push(word2);
    array.push(word3);

  }

  public findWordInArray(currentWord: WordClass){

    let flag : number = -1;
    for(let i=0; i<this.randomWordList.length; i++){
      if(this.randomWordList[i].id === currentWord.id){
        flag = 1;
        return flag;
      }
    }
    return flag;
  }

  // return 4 option word for answer per round
  public getOptionsPerRound (currentRound: number)
  {

    if(this.customGame === true)
    {
       let tempListOfRandomAnswer=this.customrandomSelectionWords.slice(currentRound, currentRound+4);
      return this.shuffle(tempListOfRandomAnswer);
    }
    else
    {
      let tempListOfRandomAnswer=this.randomSelectionWords.slice(currentRound, currentRound+4);
      return this.shuffle(tempListOfRandomAnswer);
    }
  }

  // return the question word per round
  public getCardQuestionPerRound(currentRound: number) 
  {
    if(this.customGame === true)
    {
      return this.customWordList[currentRound];
    }
    else
    {
      return this.randomWordList[currentRound];
    }
  }

  // shuffle the given words array
  public shuffle(array:WordClass[]) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  // return the result of the given game
  public getGameResults(): Promise<GameResult[]> {
    this.firebaseInfraService.importGameResults();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameResultsObservable.subscribe(arrayOfResults => {
        this.resultGameArray = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }
  
  // get all the games of the user
  public getGames(): Promise<Game[]> {
    this.firebaseInfraService.importGames();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGamesObservable.subscribe(arrayOfResults => {
        this.patientGames = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  // get all the games by uniqe email
  public getGamesByEmail(email:string): Promise<Game[]> {
    this.firebaseInfraService.importGamesByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGamesObservable.subscribe(arrayOfResults => {
        this.patientGames = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  // get all the game results by uniqe email
  public getGameResultsByEmail(email:string): Promise<GameResult[]> {
    this.firebaseInfraService.importGameResultsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameResultsObservable.subscribe(arrayOfResults => {
        this.resultGameArray = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  // get all the game settings results by uniqe email
  public getGameSettings(): Promise<GameSettings[]> {
    this.firebaseInfraService.importGameSettings();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameSettingsObservable.subscribe(settings => {
        this.gameSettings = settings;
        this.validateGame();
        resolve(this.gameSettings);
      })
    })
  }

  // get all the game settings by uniqe email
  public getGameSettingsByEmail(email:string): Promise<GameSettings[]> {
    this.firebaseInfraService.importGameSettingsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameSettingsObservable.subscribe(settings => {
        this.gameSettings = settings;
        this.validateGame();
        resolve(this.gameSettings);
      })
    })
  }

  // increase by one the right answer in the category of the word
  public increaseRightAnswer(categoryId:string)
  {
    const checkCategory = (obj: GameResult) => obj.categoryID === categoryId;
    if(this.resultGameArray.some(checkCategory)){
     let currentResult = this.resultGameArray.find(checkCategory);
     if(currentResult !== undefined){
       this.customGame ? currentResult.rightCustom.push(new Date()) : currentResult.rightRandom.push(new Date());
       this.firebaseInfraService.updateResult(currentResult);
     }
    }

    else{
      const result = new GameResult(this.firebaseInfraService.authentication.user.email,categoryId,"");
      this.customGame ? result.rightCustom.push(new Date()) : result.rightRandom.push(new Date());
      this.addResult(result);
    }
  }

  // increase by one the worng answer in the category of the word
  public increaseWrongAnswer(categoryId:string)
  {
    const checkCategory = (obj: GameResult) => obj.categoryID === categoryId;
    if(this.resultGameArray.some(checkCategory)){
      let currentResult = this.resultGameArray.find(checkCategory);
      if(currentResult !== undefined){
        this.customGame ? currentResult.wrongCustom.push(new Date()) : currentResult.wrongRandom.push(new Date());
        this.firebaseInfraService.updateResult(currentResult);
      }
    }
    
    else{
      const result = new GameResult(this.firebaseInfraService.authentication.user.email,categoryId,"");
      this.customGame ? result.wrongCustom.push(new Date()) : result.wrongRandom.push(new Date());
      this.addResult(result);
    }
  }

  public addResult(result: GameResult, callFromAppBuilder = false) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addGameResult(result)?.then(() => {
        resolve(result);
      });
    })
  }

  public addGameSettings(result: GameSettings, callFromAppBuilder = false) : Promise<any> {
    if(this.gameSettings.length === 1)
    {
      this.firebaseInfraService.removeSettings(this.gameSettings[0]);
    }

    if(this.gameSettings[0] === undefined)
    {
      this.gameSettings[0] = result;
    }

    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addGameSettings(result)?.then(() => {
        resolve(result);
      });
    })
  }

  // change lofic to accomidate custom and random
  public addGame(game: Game) : Promise<any> {
      let tempArray = this.patientGames.filter(a=> a.gameType === game.gameType);
      tempArray.sort((b, a) => new Date(b.dateOfGame).getTime() - new Date(a.dateOfGame).getTime());

    if(tempArray.length === 10)
    {
      this.firebaseInfraService.removeGame(this.patientGames[0]);
    }
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addGame(game)?.then(() => {
        resolve(game);
      });
    })
  }

  public addGameInfo(gameInfo:GameInfo){
    let gameSettings = this.gameSettings[0];
    gameSettings.listOfGames.push(gameInfo);
    this.firebaseInfraService.updateGameInfo(gameSettings);
  }

  public deleteGameInfo(gameInfo:GameInfo){
    let gameSettings = this.gameSettings[0];
    let newListOfGames = gameSettings.listOfGames.filter((e) => { return e.gameNum !== gameInfo.gameNum })
    for(let i=0; i < newListOfGames.length; i++){
      newListOfGames[i].gameNum = i;
    }
    gameSettings.listOfGames = newListOfGames;
    this.firebaseInfraService.updateGameInfo(gameSettings);
  }

  public editGameInfo(gameInfo:GameInfo){
    let gameSettings = this.gameSettings[0];
    gameSettings.listOfGames[gameInfo.gameNum] = gameInfo;
    this.firebaseInfraService.updateGameInfo(gameSettings);
  }

  public updateGameInfo(score:number){
    let gameSettings = this.gameSettings[0];
    gameSettings.listOfGames[this.currentCustomGame].isPlayed = true;
    gameSettings.listOfGames[this.currentCustomGame].numOfPlayed++;
    gameSettings.listOfGames[this.currentCustomGame].totalScore+=score;
    this.firebaseInfraService.updateGameInfo(gameSettings);
  }

  public changeRandomGame(GameSetting: GameSettings) {
    GameSetting.enableRandomGame = !GameSetting.enableRandomGame;
    this.firebaseInfraService.updateGameSettings(GameSetting);
  }

  public getAllGames(){
    return this.gameSettings[0].listOfGames;
  }

  public deleteGamesRealtedToCategory(category:CategoryClass){
    let allGames = this.getAllGames();
    let wordsArray = this.categoryInfraService.getAllUserPhrases.filter(word => word.categoryID === category.id).map(word => word.name);
    
    for(let i=0;i<allGames.length;i++){
      let toDelete = allGames[i].listOfWords.some(r=> wordsArray.includes(r));
      if(toDelete){
        this.deleteGameInfo(allGames[i]);
      }
    }
  }

  public deleteGamesRealtedToWord(word:WordClass){
    let allGames = this.getAllGames();
    let wordsArray = this.categoryInfraService.getAllUserPhrases.filter(a => a.categoryID === word.categoryID).map(a => a.name);

    if(wordsArray.length <= 4)
    {
      let category = this.categoryInfraService.categories.find(a=>a.id = word.categoryID);
      this.deleteGamesRealtedToCategory(category);
    }
    else
    {
        for(let i=0;i<allGames.length;i++)
      {
        let toDelete = allGames[i].listOfWords.some((a) => a === word.name);
        if(toDelete){
          this.deleteGameInfo(allGames[i]);
        }
      }
    }
  }

  // Validate that all the games are relevent before shpwing them
  public validateGame(){
    let games = this.gameSettings[0].listOfGames;
    let allWords =  this.categoryInfraService.getAllUserPhrases;
    
    if(games !== undefined && allWords.length > 0 ){
      for(let i=0;i<games.length;i++)
      {
        let exit = false;
        for(let j=0;j<games[i].listOfWords.length && exit === false ;j++)
        {
          let isExist = allWords.some(a => a.name === games[i].listOfWords[j]);
          if(isExist)
          {
            let word = allWords.find(a => a.name === games[i].listOfWords[j]);
            let categoryWords = allWords.filter(a=> a.categoryID === word.categoryID);

            if(categoryWords.length < 4)
            {
              this.deleteGameInfo(games[i]);
              exit = true;
            }
          }
          else{
            this.deleteGameInfo(games[i]);
            exit = true;
          }
        }
      }
    }
  }
}



