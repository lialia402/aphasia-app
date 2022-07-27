import { Injectable } from '@angular/core';
import { GameResult } from '../models/game-result.model';
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
  public finalScoreCurrentGame:number=0;
  public resultGameArray:GameResult[];
  public patientGames:Game[];

  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService,public firebaseInfraService: FirebaseInfraService) { }

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
        this.pushAnotherThreeWords(word,words);
      }
    }


    return this.randomWordList;
  }

  public pushAnotherThreeWords(word:WordClass, words:WordClass[]){
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

    this.randomSelectionWords.push(word1);
    this.randomSelectionWords.push(word2);
    this.randomSelectionWords.push(word3);

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
    let tempListOfRandomAnswer=this.randomSelectionWords.slice(currentRound, currentRound+4);
    return this.shuffle(tempListOfRandomAnswer);
  }

  public getCardQuestionPerRound(currentRound: number) 
  {
    return this.randomWordList[currentRound];
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
        console.log(this.patientGames);
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



