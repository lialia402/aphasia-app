import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { GameResult } from '../models/game-result.model';
import { Game } from '../models/game.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { GameInfraService } from './game-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})

export class AnalyticsInfraService {
  //graph category view
  topFiveCategoriesViews:number[]=[];
  topFiveCategoriesViewsWeek:number[]=[];
  topFiveCategoriesViewsMonth:number[]=[];
  topFiveCategoriesNames:string[]=[];
  topFiveCategoriesNamesWeek:string[]=[];
  topFiveCategoriesNamesMonth:string[]=[];


  allWords:WordClass[];
  allCategories:CategoryClass[];
  allGameResults:GameResult[];
  allGames:Game[];
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  
  categoriesNamesInGame:string[] = [];
  rightAnswers:number[] = [];
  wrongAnswers:number[] = [];
  dateArray: string [] = [];
  gameRightAnswers: number[] =[];

  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService, public gameInfraService: GameInfraService) {
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
    this.allGameResults = this.gameInfraService.resultGameArray;
    this.allGames=this.gameInfraService.patientGames;
   }

   public updateData(){
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
    this.allGameResults = this.gameInfraService.resultGameArray;
    this.allGames=this.gameInfraService.patientGames;
   }

  public getSortedWordsListByViewsDesc() {
    this.topTenWordsNames = [];
    this.topTenWordsViews = [];
    let listTenWords= this.allWords.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,10);
    for(let i=0; i<10; i++)
    {
      this.topTenWordsNames.push(listTenWords[i].name);
      this.topTenWordsViews.push(listTenWords[i].views);
    }
  }

  // create a list of the 5 most viewed categories by the user for all time
  public getSortedCategoriesListByViewsDesc() {
    this.topFiveCategoriesNames = [];
    this.topFiveCategoriesViews = [];
    let listFiveCategories= this.allCategories.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,5);
    for(let i=0; i<5; i++)
    {
      this.topFiveCategoriesNames.push(listFiveCategories[i].name);
      this.topFiveCategoriesViews.push(listFiveCategories[i].views);
    }
  }

  // get category analytics for view category graph
  public getCategoriesAnalytics()
  {
    this.topFiveCategoriesNamesWeek=[]
    this.topFiveCategoriesViewsWeek=[]
    this.topFiveCategoriesNamesMonth=[]
    this.topFiveCategoriesViewsMonth=[]
    this.getSortedCategoriesListByViewsDescForSpecificDates(this.topFiveCategoriesNamesWeek,this.topFiveCategoriesViewsWeek,'week');
    this.getSortedCategoriesListByViewsDescForSpecificDates(this.topFiveCategoriesNamesMonth,this.topFiveCategoriesViewsMonth,'month');
    this.getSortedCategoriesListByViewsDesc();
  }

  // create a list of the 5 most viewed categories by the user for 7 days
  public getSortedCategoriesListByViewsDescForSpecificDates(axis_x:string[],axis_y:number[],dateTime:string) {

    let copyOfCategories = this.allCategories.map(a => {return {...a}});
    
    for(let i=0; i<this.allCategories.length;i++){
      if(copyOfCategories[i].viewPerDate!==undefined)
      {
        copyOfCategories[i].viewPerDate= this.filterByDate(dateTime, copyOfCategories[i].viewPerDate.map(date => new Date(date)));
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

  public filterByDate(date:string, dates:Date[])
  {
    let array:Date[]=[];
    if(date==='week')
    {
      let [start, end] = this.getWeekDates();
      return dates.filter(d => +new Date(d) >= +start && +new Date(d) < +end);
    }

    else if(date==='month')
    {
      let now = new Date();
      let end = new Date(now);
      let start =  new Date(now.setDate(now.getDate() - 30));
      return dates.filter(d => +new Date(d) >= +start && +new Date(d) < +end);

    }
    else{
      return array;
    }
  }

  public getWeekDates()
  {
    let now = new Date();
    let dayOfWeek = now.getDay(); //0-6
    let numDay = now.getDate();

    let start = new Date(now); //copy
    start.setDate(numDay - dayOfWeek);
    start.setHours(0, 0, 0, 0);

    let end = new Date(now); //copy
    end.setDate(numDay + (7 - dayOfWeek));
    end.setHours(0, 0, 0, 0);
    return [start, end];
  }

   getGameAnswers(){
    this.categoriesNamesInGame = [];
    this.rightAnswers = [];
    this.wrongAnswers = [];
    
    for(let i=0; i<this.allGameResults.length;i++){
      const checkCategory = (obj: CategoryClass) => obj.id === this.allGameResults[i].categoryID;
      let category = this.allCategories.find(checkCategory);
      if(category !== undefined)
      {
        this.categoriesNamesInGame.push(category?.name);
      }
      this.rightAnswers.push(this.allGameResults[i].right);
      this.wrongAnswers.push(this.allGameResults[i].wrong);
    }
  }

  getGameImprovment(){

    this.dateArray = [];
    this.gameRightAnswers = [];
  
    this.allGames.sort((b, a) => new Date(b.dateOfGame).getTime() - new Date(a.dateOfGame).getTime());

    for(let i=0; i<this.allGames.length;i++){
     this.dateArray.push(new Date(this.allGames[i].dateOfGame).toLocaleDateString());
     this.gameRightAnswers.push(this.allGames[i].right);
     
    }
    
  }
}

