import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { FirebaseInfraService } from './firebase-infra.service';

@Injectable({
  providedIn: 'root'
})
export class WordInfraService {

  words: any;
  categoryName: any;

  constructor(public firebaseProvider: FirebaseInfraService) {}

  //first,calling import of all category's phrases.
  //then, create a Promise object that active only when arrayOfPhrases filled up once.
  //Promise return to an async function that handle with him.
  //subscribe listen to the db while the app is alive.
  //note that there is no relation between Promise object to  method. 
  public getPhrases(category: CategoryClass): Promise<WordClass[]> {
    this.firebaseProvider.importwords(category);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getwordsObservable.subscribe(arrayOfWords => {
        resolve(arrayOfWords);
      })
    })
  }

  /**
   * Rearrange the current phrases array by order propery.
   * usually used after adding or removing of phrase. 
   * MAKE SURE you update the local prhase array here in the provider
   *  or you are going to have a bad time
   */
  public arrangePhrasesByOrder() {
    for (var i = 0; i < this.words.length; i++) {
      this.setOrder(this.words[i], i);
    }
  }

  /**
   * add phrase, update DB and arrange by order.
   * if addPhrase called from App-Builder don't arrange by order.
   */
  public addPhrase(word: WordClass, callFromAppBuilder = false) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.addWord(word)?.then(() => {
        resolve(word);
      });
    })
  }

  /**
 * remove phrase, update DB and arrange by order.
 * 
 */
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
