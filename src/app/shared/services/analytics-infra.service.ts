import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsInfraService {

  allWords:WordClass[];
  allCategories:CategoryClass[];
  topTenWordsViews:number[]=[];
  topTenWordsNames:string[]=[];
  topFiveCategoriesNames:string[]=[];
  topFiveCategoriesViews:number[]=[];
  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService) {
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.categoryInfraService.getCategories;
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
}

