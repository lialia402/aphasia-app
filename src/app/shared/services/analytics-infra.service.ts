import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { GameResult } from '../models/game-result.model';
import { Game } from '../models/game.model';
import { TestInfo } from '../models/test-info.model';
import { TestResult } from '../models/test-result.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { EquizInfraService } from './equiz-infra.service';
import { GameInfraService } from './game-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})

export class AnalyticsInfraService {

  // All data
  allWords:WordClass[];
  allCategories:CategoryClass[];
  allGameResults:GameResult[];
  allGames:Game[];
  allTestResults:TestResult[];
  allTests:TestInfo[];

  // graph category view
  topFiveCategoriesViews:number[]=[];
  topFiveCategoriesNames:string[]=[];
  fiveCategoryMinDate:Date;
  fiveCategoryMaxDate:Date;

  // graph word view
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  topTenWordsMinDate:Date;
  topTenWordsMaxDate:Date;
  
  // graph wrong start
  categoriesNamesInGame:string[] = [];
  rightAnswers:number[] = [];
  wrongAnswers:number[] = [];
  wrongRightMinDate:Date;
  wrongRightMaxDate:Date;

  // games graph
  dateArray: string [] = [];
  gameRightAnswers: number[] =[];

  // test min/max
  testMinDate:Date;
  testMaxDate:Date;

  // test time spent graph
  timeSpentArray: number [] = [];
  timeSpentName: string [] = [];

  // test grade graph
  testGradeArray: number[] = [];
  testGradeNames: string [] = [];
  

  constructor(
    public categoryInfraService: CategoryInfraService,
    public wordInfraService: WordInfraService, 
    public gameInfraService: GameInfraService,
    public testInfraService: EquizInfraService) {
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
    this.allGameResults = this.gameInfraService.resultGameArray;
    this.allGames=this.gameInfraService.patientGames;
    this.allTestResults=this.testInfraService.testResult;
    this.allTests=this.testInfraService.tests;
   }

   public updateData(){
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
    this.allGameResults = this.gameInfraService.resultGameArray;
    this.allGames=this.gameInfraService.patientGames;
    this.allTestResults=this.testInfraService.testResult;
    this.allTests=this.testInfraService.tests;
   }

  public getSortedWordsListByViewsDesc() {
    this.topTenWordsNames.splice(0, this.topTenWordsNames.length);
    this.topTenWordsViews.splice(0, this.topTenWordsViews.length);
    let listTenWords= this.allWords.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,10);
    for(let i=0; i<10; i++)
    {
      this.topTenWordsNames.push(listTenWords[i].name);
      this.topTenWordsViews.push(listTenWords[i].views);
    }
  }

  public getWrongRightMinMaxValues(){
    let datesArray:Date[] = [];
    for(let i=0;i<this.allGameResults.length;i++){
        datesArray = datesArray.concat(this.allGameResults[i].rightCustom.map(date => new Date(date)));
        datesArray = datesArray.concat(this.allGameResults[i].wrongCustom.map(date => new Date(date)));
        datesArray = datesArray.concat(this.allGameResults[i].rightRandom.map(date => new Date(date)));
        datesArray = datesArray.concat(this.allGameResults[i].wrongRandom.map(date => new Date(date)));
    }
    datesArray.sort((b, a) => new Date(b).getTime() - new Date(a).getTime());
    this.wrongRightMinDate = datesArray[0];
    this.wrongRightMaxDate = datesArray[datesArray.length-1];
    this.wrongRightMaxDate.setDate(this.wrongRightMaxDate.getDate() + 1);
  }

  public getTestMinMaxValues(){
    let datesArray:Date[] = [];
    datesArray.splice(1,datesArray.length);
    for(let i=0;i<this.allTestResults.length;i++){
      let date = new Date(this.allTestResults[i].answerDate);
      datesArray.push(date);
    }

    datesArray.sort((b, a) => new Date(b).getTime() - new Date(a).getTime());

    this.testMinDate = datesArray[0];
    this.testMaxDate = datesArray[datesArray.length-1];
    this.testMaxDate.setDate(this.testMaxDate.getDate() + 1);
  }


  public getCategoriesMinMaxDateValues(){
    let datesArray:Date[] = [];
    for(let i=0;i<this.allCategories.length;i++){
      if(this.allCategories[i].viewPerDate !== undefined)
      {
        datesArray = datesArray.concat(this.allCategories[i].viewPerDate.map(date => new Date(date)));
      }
    }

    datesArray.sort((b, a) => new Date(b).getTime() - new Date(a).getTime());

    this.fiveCategoryMinDate = datesArray[0];
    this.fiveCategoryMaxDate = datesArray[datesArray.length-1];
    this.fiveCategoryMaxDate.setDate(this.fiveCategoryMaxDate.getDate() + 1);

    datesArray = [];

    for(let i=0;i<this.allWords.length;i++){
      if(this.allWords[i].viewPerDate !== undefined)
      {
        datesArray = datesArray.concat(this.allWords[i].viewPerDate.map(date => new Date(date)));
      }
    }

    datesArray.sort((b, a) => new Date(b).getTime() - new Date(a).getTime());

    this.topTenWordsMinDate = datesArray[0];
    this.topTenWordsMaxDate = datesArray[datesArray.length-1];
    this.topTenWordsMaxDate.setDate(this.topTenWordsMaxDate.getDate() + 1);
  }


  // create a list of the 5 most viewed categories by the user for all time
  public getSortedCategoriesListByViewsDesc() {
    this.topFiveCategoriesNames.splice(0, this.topFiveCategoriesNames.length);
    this.topFiveCategoriesViews.splice(0, this.topFiveCategoriesViews.length);
    let listFiveCategories= this.allCategories.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,5);
    for(let i=0; i<5; i++)
    {
      this.topFiveCategoriesNames.push(listFiveCategories[i].name);
      this.topFiveCategoriesViews.push(listFiveCategories[i].views);
    }
  }

  public getSortedCategoriesListByStartAndEndDate(axis_x:string[],axis_y:number[],start:Date ,end:Date) {
    end.setDate(end.getDate() + 1);
    axis_x.splice(0, axis_x.length);
    axis_y.splice(0,axis_y.length);

    let copyOfCategories = this.allCategories.map(a => {return {...a}});
    
    for(let i=0; i<this.allCategories.length;i++){
      if(copyOfCategories[i].viewPerDate!==undefined)
      {
        copyOfCategories[i].viewPerDate= this.filterByStartAndEnd(start, end, copyOfCategories[i].viewPerDate.map(date => new Date(date)));
      }
    }

     copyOfCategories= copyOfCategories.filter(a=> a.viewPerDate!==undefined);
     let listFiveCategories= copyOfCategories.sort((a,b) => (a.viewPerDate.length < b.viewPerDate.length) ? 1 : ((b.viewPerDate.length < a.viewPerDate.length) ? -1 : 0)).slice(0,5);
     for(let i=0; i<5; i++)
     {
       axis_x.push(listFiveCategories[i].name);
       axis_y.push(listFiveCategories[i].viewPerDate.length);
     }
  }

  public getSortedWordsListByStartAndEndDate(axis_x:string[],axis_y:number[],start:Date ,end:Date) {
    end.setDate(end.getDate() + 1);
    axis_x.splice(0, axis_x.length);
    axis_y.splice(0,axis_y.length);

    let copyOfWords = this.allWords.map(a => {return {...a}});
    
    for(let i=0; i<this.allWords.length;i++){
      if(copyOfWords[i].viewPerDate!==undefined)
      {
        copyOfWords[i].viewPerDate= this.filterByStartAndEnd(start, end, copyOfWords[i].viewPerDate.map(date => new Date(date)));
      }
    }

    copyOfWords= copyOfWords.filter(a=> a.viewPerDate!==undefined);
     let listTenWords= copyOfWords.sort((a,b) => (a.viewPerDate.length < b.viewPerDate.length) ? 1 : ((b.viewPerDate.length < a.viewPerDate.length) ? -1 : 0)).slice(0,10);
     for(let i=0; i<10; i++)
     {
       axis_x.push(listTenWords[i].name);
       axis_y.push(listTenWords[i].viewPerDate.length);
     }
  }

  filterByStartAndEnd(start:Date,end:Date,dates: Date[]){
    let tempArray = dates.filter((item: any) =>
    item.getTime() >= start.getTime() && item.getTime() <= end.getTime()
    );
    return tempArray;
  }

  filterTestByStartAndEnd(start:Date,end:Date,dates: TestResult[]){
    let tempArray = dates.filter((item: TestResult) =>
    new Date(item.answerDate).getTime()>= start.getTime() && new Date (item.answerDate).getTime() <= end.getTime()
    );
    return tempArray;
  }

  // get category analytics for view category graph
  public getCategoriesAnalytics()
  {
    this.getCategoriesMinMaxDateValues();
    this.getWrongRightMinMaxValues();
    this.getTestMinMaxValues();
    this.getSortedCategoriesListByViewsDesc();
  }

  filterWrongRightByEndStart(start:Date,end:Date,type:number){
    end.setDate(end.getDate() + 1);
    this.categoriesNamesInGame.splice(0, this.categoriesNamesInGame.length);
    this.rightAnswers.splice(0, this.rightAnswers.length);
    this.wrongAnswers.splice(0, this.wrongAnswers.length);

    for(let i=0; i<this.allGameResults.length;i++){
      const checkCategory = (obj: CategoryClass) => obj.id === this.allGameResults[i].categoryID;
      let category = this.allCategories.find(checkCategory);
      if(category !== undefined)
      {
        this.categoriesNamesInGame.push(category?.name);
      }

      if(type === 0)
      {
        this.rightAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].rightCustom.map(date => new Date(date))).length +
        this.filterByStartAndEnd(start,end,this.allGameResults[i].rightRandom.map(date => new Date(date))).length);
        this.wrongAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].wrongCustom.map(date => new Date(date))).length +
        this.filterByStartAndEnd(start,end,this.allGameResults[i].wrongRandom.map(date => new Date(date))).length);
      }
      else if(type === 1){
        this.rightAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].rightCustom.map(date => new Date(date))).length);
        this.wrongAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].wrongCustom.map(date => new Date(date))).length);
      }

      else{
        this.rightAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].rightRandom.map(date => new Date(date))).length);
        this.wrongAnswers.push(this.filterByStartAndEnd(start,end,this.allGameResults[i].wrongRandom.map(date => new Date(date))).length);
      }
     
    }
  }

   getGameAnswers(type:number){
    this.categoriesNamesInGame.splice(0, this.categoriesNamesInGame.length);
    this.rightAnswers.splice(0, this.rightAnswers.length);
    this.wrongAnswers.splice(0, this.wrongAnswers.length);
    
    for(let i=0; i<this.allGameResults.length;i++){
      const checkCategory = (obj: CategoryClass) => obj.id === this.allGameResults[i].categoryID;
      let category = this.allCategories.find(checkCategory);
      if(category !== undefined)
      {
        this.categoriesNamesInGame.push(category?.name);
      }

      if(type === 0)
      {
        this.rightAnswers.push(this.allGameResults[i].rightCustom.length + this.allGameResults[i].rightRandom.length);
        this.wrongAnswers.push(this.allGameResults[i].wrongCustom.length + this.allGameResults[i].wrongRandom.length);
      }

      else if(type === 1){
        this.rightAnswers.push(this.allGameResults[i].rightCustom.length);
        this.wrongAnswers.push(this.allGameResults[i].wrongCustom.length);
      }

      else{
        this.rightAnswers.push(this.allGameResults[i].rightRandom.length);
        this.wrongAnswers.push(this.allGameResults[i].wrongRandom.length);
      }
      
    }
  }

  getGameImprovment(){

    this.dateArray.splice(0, this.dateArray.length);
    this.gameRightAnswers.splice(0, this.gameRightAnswers.length);
  
    this.allGames.sort((b, a) => new Date(b.dateOfGame).getTime() - new Date(a.dateOfGame).getTime());

    for(let i=0; i<this.allGames.length;i++){
     this.dateArray.push(new Date(this.allGames[i].dateOfGame).toLocaleDateString());
     this.gameRightAnswers.push(this.allGames[i].right);
     
    }
    
  }

  getTestDuration(){

    this.timeSpentArray.splice(0, this.timeSpentArray.length);
    this.timeSpentName.splice(0, this.timeSpentName.length);
  
    this.allTestResults.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());

    for(let i=0; i<this.allTestResults.length;i++){
     this.timeSpentArray.push(this.allTestResults[i].duration);
     let testName = this.allTests.find(test => test.id === this.allTestResults[i].testId)
     if(testName !== undefined){
      this.timeSpentName.push(testName?.nameOfTest);
     }
    }
    
  }

  getTestImprovemnt(){

    this.testGradeArray.splice(0, this.testGradeArray.length);
    this.testGradeNames.splice(0, this.testGradeNames.length);
  
    this.allTestResults.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());

    for(let i=0; i<this.allTestResults.length;i++){
     this.testGradeArray.push(this.allTestResults[i].rightList.length);
     let testName = this.allTests.find(test => test.id === this.allTestResults[i].testId)
     if(testName !== undefined){
      this.testGradeNames.push(testName?.nameOfTest);
     }
    }
    
  }

  getSortedTestDurationByStartAndEndDate(start:Date,end:Date){
    this.timeSpentArray.splice(0, this.timeSpentArray.length);
    this.timeSpentName.splice(0, this.timeSpentName.length);
    this.allTestResults.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());

    let filteredArray = this.filterTestByStartAndEnd(start,end,this.allTestResults);
    for(let i=0; i<filteredArray.length;i++){
      this.timeSpentArray.push(filteredArray[i].duration);
      let testName = this.allTests.find(test => test.id === filteredArray[i].testId)
      if(testName !== undefined){
       this.timeSpentName.push(testName?.nameOfTest);
      }
    }
  }

  getSortedTestGradeByStartAndEndDate(start:Date,end:Date){
    this.testGradeArray.splice(0, this.testGradeArray.length);
    this.testGradeNames.splice(0, this.testGradeNames.length);
  
    this.allTestResults.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());

    let filteredArray = this.filterTestByStartAndEnd(start,end,this.allTestResults);
    for(let i=0; i<filteredArray.length;i++){
      this.testGradeArray.push(filteredArray[i].rightList.length);
      let testName = this.allTests.find(test => test.id === filteredArray[i].testId)
      if(testName !== undefined){
       this.testGradeNames.push(testName?.nameOfTest);
      }
    }
  }

  filterAllGameByType(type:number){
    this.dateArray.splice(0, this.dateArray.length);
    this.gameRightAnswers.splice(0, this.gameRightAnswers.length);

    let tempArray = this.allGames.filter(game => game.gameType === type);
    for(let i=0; i<tempArray.length;i++){
      this.dateArray.push(new Date(tempArray[i].dateOfGame).toLocaleDateString());
      this.gameRightAnswers.push(tempArray[i].right);
     }

  }
}

