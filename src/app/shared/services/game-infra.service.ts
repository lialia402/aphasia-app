import { Injectable } from '@angular/core';
import { WordClass } from '../models/word-class.model';
import { CategoryInfraService } from './category-infra.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})
export class GameInfraService {
  public randomWordList:WordClass[]= [];
  public randomSelectionWords:WordClass[]= [];

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
      while(category.length < 4){
        category = this.giveRandomCategory();
      }
      let promise= this.wordInfraService.getPhrases(category);

      await promise.then((data) => {
        words = data;
      })

      word = this.giveRandomWord(words);

      if(this.findWordInArray(word) !== 1)
      {
        this.randomWordList.push(word);
        this.pushAnotherThreeWords(word,words);
      }

    }

    console.log('the original',this.randomWordList);
    console.log('the list',this.randomSelectionWords);


    return this.randomWordList;
  }

  public pushAnotherThreeWords(word:WordClass, words:WordClass[]){
    let word1 = this.giveRandomWord(words);
    let word2 = this.giveRandomWord(words);
    let word3 = this.giveRandomWord(words);

    while(word1.id === word.id)
    {
      word1 = this.giveRandomWord(words);
    }

    while(word2.id === word.id || word2.id === word1.id)
    {
      word2 = this.giveRandomWord(words);
    }

    while(word3.id === word.id || word3.id === word1.id || word3.id === word2.id)
    {
      word3 = this.giveRandomWord(words);
    }

    this.randomSelectionWords.push(word1);
    this.randomSelectionWords.push(word2);
    this.randomSelectionWords.push(word3);

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
