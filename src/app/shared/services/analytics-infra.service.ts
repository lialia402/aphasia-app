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

  allWords:WordClass[];
  allCategories:CategoryClass[];
  allGameResults:GameResult[];
  allGames:Game[];
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  topFiveCategoriesNames:string[]=[];
  topFiveCategoriesViews:number[]=[];
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

  public getSortedWordsListByViewsDesc() {
    let listTenWords= this.allWords.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,10);
    for(let i=0; i<10; i++)
    {
      this.topTenWordsNames.push(listTenWords[i].name);
      this.topTenWordsViews.push(listTenWords[i].views);
    }
  }

  // create a list of the 5 most viewed categories by the user
  public getSortedCategoriesListByViewsDesc() {
    let listFiveCategories= this.allCategories.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,5);
    for(let i=0; i<5; i++)
    {
      this.topFiveCategoriesNames.push(listFiveCategories[i].name);
      this.topFiveCategoriesViews.push(listFiveCategories[i].views);
    }
  }

   getGameAnswers(){
    
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

    console.log(this.allGames);
    this.allGames.sort((b, a) => new Date(b.dateOfGame).getTime() - new Date(a.dateOfGame).getTime());
    console.log(this.allGames);

    for(let i=0; i<this.allGames.length;i++){
     this.dateArray.push(new Date(this.allGames[i].dateOfGame).toLocaleDateString());
     this.gameRightAnswers.push(this.allGames[i].right);
     
    }

    console.log( this.dateArray);
    console.log(this.gameRightAnswers);
    
  }
}

