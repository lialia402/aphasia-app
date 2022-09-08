import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { TestInfo } from '../models/test-info.model';
import { TestResult } from '../models/test-result.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { GameInfraService } from './game-infra.service';
import { WordInfraService } from './word-infra.service';

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
    public wordInfraService: WordInfraService,
  ) 
  { 
    this.getTests();
    this.getTestResult();
  }

  // get the only active test if there is one
  public getActiveTest()
  {
    return this.tests.filter(a=> a.isPlayed===false)[0];
  }

  // get list of all disactive tests 
  public getDisactiveTest()
  {
    return this.tests.filter(a=> a.isPlayed===true);
  }

  // get all relavant tests
  public getTests(): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestInfo();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        this.validateTest();
        resolve(arrayOfResults);
      })
    })
  }

  // get all relavant tests by unique email
  public getTestsByEmail(email:string): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        this.validateTest();
        resolve(arrayOfResults);
      })
    })
  }

  // get all relavant test results 
  public getTestResult(): Promise<TestResult[]> {
    this.firebaseInfraService.importTestResult();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestResultsObservable.subscribe(arrayOfResults => {
        this.testResult = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public validWords(){
    return this.gameInfra.countValidWords();
  }

  // get all relavant test results by unique email
  public getTestResultByEmail(email:string): Promise<TestResult[]> {
    this.firebaseInfraService.imporTestResultByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestResultsObservable.subscribe(arrayOfResults => {
        this.testResult = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  // add test info to DB
  public addTestInfo(testInfo:TestInfo)
  {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addTestInfo(testInfo)?.then(() => {
        resolve(testInfo);
      });
    })
  }

  // add test resulr to DB
  public addTestResult(testResult:TestResult)
  {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addTestResult(testResult)?.then(() => {
        resolve(testResult);
      });
    })
  }

  // delete test
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

  // return the word object of options for answer per round
  public getOptionsPerRound (currentRound: number)
  {
      let tempListOfRandomAnswer=this.testQuestionsSelectionWords.slice(currentRound, currentRound+4);
      return this.gameInfra.shuffle(tempListOfRandomAnswer);
  }

  // return the word object of question per round
  public getCardQuestionPerRound(currentRound: number) 
  {
      return this.testQuestionsList[currentRound];
  }

  // return words object list of questions 
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

  // validate that all the tests are relevent before shpwing them
  public validateTest(){
    let activeTest = this.getActiveTest();
    let allWords =  this.categoryInfraService.getAllUserPhrases;
  
    let exit = false;
    if(activeTest !== undefined && allWords.length > 0 ){
      for(let i=0;i<activeTest.wordList.length && exit === false;i++)
      {
        let isExist = allWords.some(a => a.name === activeTest.wordList[i]);
        if(isExist)
        {
          let word = allWords.find(a => a.name === activeTest.wordList[i]);
          let categoryWords = allWords.filter(a=> a.categoryID === word.categoryID);

          if(categoryWords.length < 4)
          {
            this.updateDisActivateTest(activeTest);
            exit = true;
          }
        }
        else{
          this.updateDisActivateTest(activeTest);
          exit = true;
        }
      }
    }
  }
}
