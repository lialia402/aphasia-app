import { Injectable } from '@angular/core';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})
export class GameInfraService {
  public randomWordList:WordClass[]= [];

  constructor(public categoryInfraService: CategoryInfraService, public wordInfraService: WordInfraService) { }

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
    console.log(this.randomWordList.length);
    while (this.randomWordList.length < 10) {
      category = this.giveRandomCategory();
      let promise= this.wordInfraService.getPhrases(category);

      await promise.then((data) => {
        words = data;
      })

      word = this.giveRandomWord(words);

      if(this.findWordInArray(word) !== 1)
      {
        this.randomWordList.push(word);
      }
    }

    return this.randomWordList;
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
}
