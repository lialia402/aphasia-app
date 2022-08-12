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
  // graph category view
  topFiveCategoriesViews:number[]=[];
  topFiveCategoriesNames:string[]=[];
  fiveCategoryMinDate:Date;
  fiveCategoryMaxDate:Date;



  allWords:WordClass[];
  allCategories:CategoryClass[];
  allGameResults:GameResult[];
  allGames:Game[];

  // graph word view
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  topTenWordsMinDate:Date;
  topTenWordsMaxDate:Date;
  
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

  public getMinMaxDateValues(){
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

    datesArray = [];

    for(let i=0;i<this.allCategories.length;i++){
      if(this.allWords[i].viewPerDate !== undefined)
      {
        datesArray = datesArray.concat(this.allWords[i].viewPerDate.map(date => new Date(date)));
      }
    }

    datesArray.sort((b, a) => new Date(b).getTime() - new Date(a).getTime());

    this.topTenWordsMinDate = datesArray[0];
    this.topTenWordsMaxDate = datesArray[datesArray.length-1];

    console.log(this.topTenWordsMinDate);
    console.log(this.topTenWordsMaxDate);
  
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
    axis_x.splice(0, axis_x.length);
    axis_y.splice(0,axis_y.length);

    let copyOfWords = this.allWords.map(a => {return {...a}});
    
    for(let i=0; i<this.allGames.length;i++){
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

  // get category analytics for view category graph
  public getCategoriesAnalytics()
  {
    this.getMinMaxDateValues();
    this.getSortedCategoriesListByViewsDesc();
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

