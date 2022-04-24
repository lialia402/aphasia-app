import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { ErrorInfra } from './error-infra.service';
import { FirebaseInfraService } from './firebase-infra.service';

@Injectable({
  providedIn: 'root'
})
export class WordInfraService {

  words: any;
  categoryName: any;

  constructor(public firebaseProvider: FirebaseInfraService, //public error: ErrorInfra
  ) {
  }

  public getPhrases(category: CategoryClass): Promise<WordClass[]> {
    this.firebaseProvider.importwords(category);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getwordsObservable.subscribe(arrayOfWords => {
        resolve(arrayOfWords);
      })
    })
  }

  public getPhraseByName(n: string): Promise<WordClass> {
    return new Promise((resolve, reject) => {
      try {
        let temp = this.words.find((words: { name: string; }) => words.name == n);
        resolve(temp)
      }
      catch (e) {
        //this.error.simpleToast("The wanted category doesn't exist")
      }
    })
  }

  public arrangePhrasesByOrder() {
    for (var i = 0; i < this.words.length; i++) {
      this.setOrder(this.words[i], i);
    }
  }

  public getPhraseById(id: string): Promise<WordClass> {
    return new Promise((resolve, reject) => {
      try {
        let temp = this.words.find((word: { id: string; }) => word.id === id)
        resolve(temp)
      }
      catch (e) {
        //this.error.simpleToast("The wanted category doesn't exist")
      }
    })
  }


  public addPhrase(word: WordClass, callFromAppBuilder = false) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.addWord(word)?.then(() => {
        resolve(word);
      });
    })
  }

  public removePhrase(phrase: WordClass) {
    this.firebaseProvider.removePhrase(phrase);
  }

  //SETTERS
  public setName(word: WordClass, newName: string) {
    word.name = newName;
    this.firebaseProvider.updateWord(word)
  }
  public setImageUrl(phrase: WordClass, newURL: string) {
    phrase.imageURL = newURL;
    this.firebaseProvider.updateWord(phrase)
  }
  public setAudioUrl(phrase: WordClass, newURL: string) {
    phrase.audio = newURL;
    this.firebaseProvider.updateWord(phrase)
  }
  public setCategoryID(phrase: WordClass, newCategoryParent: string) {
    phrase.categoryID = newCategoryParent;
    this.firebaseProvider.updateWord(phrase)
  }
  public setIsFav(phrase: WordClass, isFav: boolean) {
    phrase.isFav = isFav;
    this.firebaseProvider.updateWord(phrase);
  }
  //each time a category has chosen, her views increase by 1.
  public increaseViews(phrase: WordClass) {
    phrase.views++;
    this.firebaseProvider.updateWord(phrase)
  }
  public setOrder(phrase: WordClass, order: number) {
    phrase.order = order;
    this.firebaseProvider.updateWord(phrase);
  }
  public updateWord(phrase: WordClass) {
    this.firebaseProvider.updateWord(phrase)
  }
  public changeVisibility(phrase: WordClass) {
    phrase.visibility = !phrase.visibility;
    this.firebaseProvider.updateWord(phrase);
  }
}
