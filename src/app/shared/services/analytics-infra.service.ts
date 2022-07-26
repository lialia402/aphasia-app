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
  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService) {
    this.allWords=this.categoryInfraService.getAllUserPhrases;
    this.allCategories=this.allCategories;
    // this.getSortedListByViewsDesc();
   }

  public getSortedListByViewsDesc() {
    let listTenWords= this.allWords.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice(0,9);
    console.log(listTenWords)
    for(let i=0; i<9; i++)
    {
      this.topTenWordsNames.push(listTenWords[i].name);
      this.topTenWordsViews.push(listTenWords[i].views);
    }
  }
}

