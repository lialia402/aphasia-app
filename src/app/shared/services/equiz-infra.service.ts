import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { TestInfo } from '../models/test-info.model';
import { TestResult } from '../models/test-result.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { GameInfraService } from './game-infra.service';

@Injectable({
  providedIn: 'root'
})
export class EquizInfraService {

  public testQuestionsList:WordClass[]= [];
  public testQuestionsSelectionWords:WordClass[]= [];
  public tests: TestInfo[]=[];
  public testResult: TestResult[]=[];
  
  constructor(
    public firebaseInfraService: FirebaseInfraService,
    public gameInfra: GameInfraService,
    public categoryInfraService: CategoryInfraService,
  ) 
  { 
    this.getTests();
    this.getTestResult();
  }

  public getActiveTest()
  {
    return this.tests.filter(a=> a.isPlayed===false)[0];
  }

  public getDisactiveTest()
  {
    return this.tests.filter(a=> a.isPlayed===true);
  }

  public getTests(): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestInfo();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getTestsByEmail(email:string): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getTestResult(): Promise<TestResult[]> {
    this.firebaseInfraService.importTestResult();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestResultsObservable.subscribe(arrayOfResults => {
        this.testResult = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getTestResultByEmail(email:string): Promise<TestResult[]> {
    this.firebaseInfraService.imporTestResultByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestResultsObservable.subscribe(arrayOfResults => {
        this.testResult = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public addTestInfo(testInfo:TestInfo)
  {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addTestInfo(testInfo)?.then(() => {
        resolve(testInfo);
      });
    })
  }

  public addTestResult(testResult:TestResult)
  {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addTestResult(testResult)?.then(() => {
        resolve(testResult);
      });
    })
  }

  public deleteTestInfo(testInfo:TestInfo)
  {
    this.firebaseInfraService.removeTestInfo(testInfo);
  }

  public updateActivateTest(testInfo:TestInfo)
  {
    testInfo.isPlayed=false;
    this.firebaseInfraService.updateTestInfo(testInfo);
  }

  public updateDisActivateTest(testInfo:TestInfo)
  {
    testInfo.isPlayed=true;
    this.firebaseInfraService.updateTestInfo(testInfo);
  }

  public getOptionsPerRound (currentRound: number)
  {
      let tempListOfRandomAnswer=this.testQuestionsSelectionWords.slice(currentRound, currentRound+4);
      return this.gameInfra.shuffle(tempListOfRandomAnswer);
  }

  public getCardQuestionPerRound(currentRound: number) 
  {
      return this.testQuestionsList[currentRound];
  }

  public giveTestList(){
    let testArray=this.getActiveTest();
    let category:CategoryClass;
    let words: WordClass[] = [];
    let word:WordClass;

    this.testQuestionsList = [];
    this.testQuestionsSelectionWords=[];
    let i=0;
    while (this.testQuestionsList.length < 10) {

      word = this.gameInfra.findWordByName(testArray.wordList[i]);
  
      const checkCategory = (obj: CategoryClass) => obj.id === word.categoryID;
      category = this.categoryInfraService.categories.find(checkCategory);
      words = this.categoryInfraService.getAllUserPhrases.filter((word) => {return word.categoryID === category.id})

      this.testQuestionsList.push(word);
      this.testQuestionsSelectionWords.push(word);
      this.gameInfra.pushAnotherThreeWords(word,words,this.testQuestionsSelectionWords);
      
      i++;
    }
    return this.testQuestionsList;
  }
}
