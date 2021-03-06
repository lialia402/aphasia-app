import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
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

  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService,public firebaseInfraService: FirebaseInfraService) {

   }

  public giveRandomCategory(){
    let randomNumber = Math.floor(Math.random()*this.categoryInfraService.categories.length);
    return this.categoryInfraService.categories[randomNumber];
  }

  public giveRandomWord(words : WordClass[]){
    let randomNumber = Math.floor(Math.random()*words.length);
    return words[randomNumber];
  }


  public async giveRandomList(){
    let category;
    let words: WordClass[] = [];
    let word;

    this.randomWordList = [];
    this.randomSelectionWords=[];
    while (this.randomWordList.length < 10) {
      category = this.giveRandomCategory();
      while(category.length < 4){
        category = this.giveRandomCategory();
      }
      let promise= this.wordInfraService.getPhrases(category);

      await promise.then((data) => {
        words = data;
      })

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

  public async giveCustomList(){
    let category:CategoryClass;
    let words: WordClass[] = [];
    let word:WordClass;

    this.customWordList = [];
    this.customrandomSelectionWords=[];
    let i=0;
    while (this.customWordList.length < 10) {

      // Get word object by only string name
      word = this.findWordByName(this.gameSettings[0].words[i]);
  
      const checkCategory = (obj: CategoryClass) => obj.id === word.categoryID;
      category = this.categoryInfraService.categories.find(checkCategory);

      let promiseOfWords= this.wordInfraService.getPhrases(category);

      await promiseOfWords.then((data) => {
        words = data;
      })

      this.customWordList.push(word);
      this.customrandomSelectionWords.push(word);
      this.pushAnotherThreeWords(word,words,this.customrandomSelectionWords);
      
      i++;
    }
    return this.customWordList;
  }

  findWordByName(wordName: string){
    const findWord = (obj: WordClass) => obj.name === wordName;
    let currentWord = this.categoryInfraService.getAllUserPhrases.find(findWord);
    return currentWord;
}

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


  public getGameResults(): Promise<GameResult[]> {
    this.firebaseInfraService.importGameResults();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameResultsObservable.subscribe(arrayOfResults => {
        this.resultGameArray = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getGames(): Promise<Game[]> {
    this.firebaseInfraService.importGames();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGamesObservable.subscribe(arrayOfResults => {
        this.patientGames = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getGamesByEmail(email:string): Promise<Game[]> {
    this.firebaseInfraService.importGamesByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGamesObservable.subscribe(arrayOfResults => {
        this.patientGames = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getGameResultsByEmail(email:string): Promise<GameResult[]> {
    this.firebaseInfraService.importGameResultsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameResultsObservable.subscribe(arrayOfResults => {
        this.resultGameArray = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

   public getGameSettings(): Promise<GameSettings[]> {
    this.firebaseInfraService.importGameSettings();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameSettingsObservable.subscribe(settings => {
        this.gameSettings = settings;
        resolve(this.gameSettings);
      })
    })
  }

  public getGameSettingsByEmail(email:string): Promise<GameSettings[]> {
    this.firebaseInfraService.importGameSettingsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getGameSettingsObservable.subscribe(settings => {
        this.gameSettings = settings;
        resolve(this.gameSettings);
      })
    })
  }

  public increaseRightAnswer(categoryId:string)
  {

    const checkCategory = (obj: GameResult) => obj.categoryID === categoryId;
    if(this.resultGameArray.some(checkCategory)){
     let currentResult = this.resultGameArray.find(checkCategory);
     if(currentResult !== undefined){
       currentResult.right++;
       this.firebaseInfraService.updateResult(currentResult);
     }

    }
    else
    {
      const result = new GameResult(this.firebaseInfraService.authentication.user.email,categoryId,1,0);
      this.addResult(result);
    }
  
  }

  public increaseWrongAnswer(categoryId:string)
  {
    const checkCategory = (obj: GameResult) => obj.categoryID === categoryId;
    if(this.resultGameArray.some(checkCategory)){
      let currentResult = this.resultGameArray.find(checkCategory);
      if(currentResult !== undefined){
        currentResult.wrong++;
        this.firebaseInfraService.updateResult(currentResult);
      }

    }
    else
    {
      const result = new GameResult(this.firebaseInfraService.authentication.user.email,categoryId,0,1);
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

    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addGameSettings(result)?.then(() => {
        resolve(result);
      });
    })
  }

  public addGame(game: Game) : Promise<any> {

    if(this.patientGames.length === 10)
    {
      this.patientGames.sort((b, a) => new Date(b.dateOfGame).getTime() - new Date(a.dateOfGame).getTime());
      this.firebaseInfraService.removeGame(this.patientGames[0]);
    }

    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addGame(game)?.then(() => {
        resolve(game);
      });
    })
  }
}



