import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { GameResult } from '../models/game-result.model';
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
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  topFiveCategoriesNames:string[]=[];
  topFiveCategoriesViews:number[]=[];
  categoriesNamesInGame:string[] = [];
  rightAnswers:number[] = [];
  wrongAnswers:number[] = [];
  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService, public gameInfraService: GameInfraService) {
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
    this.allGameResults = this.gameInfraService.resultGameArray;
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
}

