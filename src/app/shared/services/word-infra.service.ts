import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { AuthService } from './auth.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { UserInfaService } from './user-infa.service';

@Injectable({
  providedIn: 'root'
})
export class WordInfraService {

  words: any;
  superAdminWords:any;
  categoryName: any;
  categories: CategoryClass[];
  public currentCategory: CategoryClass;

  constructor(
    public firebaseProvider: FirebaseInfraService,
    public authentication: AuthService,
    public userInfra: UserInfaService,) {}

  // get all words of a category and subscribes to the collection
  public getPhrases(category: CategoryClass): Promise<WordClass[]> {
    this.firebaseProvider.importwords(category);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getwordsObservable.subscribe(arrayOfWords => {
        this.words = arrayOfWords;
        resolve(arrayOfWords);
      })
    })
  }

  // get all words by name and subscribes to the collection
  public getPhrasesByName(name: string): Promise<WordClass[]> {
    this.firebaseProvider.importwordsByName(name);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getwordsObservable.subscribe(arrayOfWords => {
        this.words = arrayOfWords;
        resolve(arrayOfWords);
      })
    })
  }

  public getSuperAdminPhrases(category: CategoryClass): Promise<WordClass[]> {
    this.firebaseProvider.importSuperAdminWords(category);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getSuperAdminWordsObservable.subscribe(arrayOfWords => {
        this.superAdminWords = arrayOfWords;
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
      if(this.authentication.user.userType === 'superAdmin')
      {
        this.firebaseProvider.addSuperAdminWord(word)?.then(async () => {
          let patients = this.userInfra.getAllPatients();
          for(let i=0;i<patients.length;i++){
            debugger;
            let promise = await this.importCategoriesArrayByEmail(patients[i].email);
            let category = promise.find(category => category.name === this.currentCategory.name);
            if(category !== undefined){
              let anotherPromise = await this.getPhrases(category);
              this.words = anotherPromise;
              word.categoryID = this.categories.find(category => category.name === this.currentCategory.name)?.id || 'missing';
              word.visibility = false;
              this.firebaseProvider.addWord(word)?.then(() => {
              resolve(word);
            }); 
            }
          }
          resolve(word);
        });
      }

      else{
        this.firebaseProvider.addWord(word)?.then(() => {
          resolve(word);
        });
      }
    })
  }

   // updating the categories and refreshing the page, the method return a Promise object
   public importCategoriesArrayByEmail(email:string): Promise<CategoryClass[]> {
    this.firebaseProvider.importCategoriesByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getCategoriesObservable.subscribe(arrayOfWords => {
        this.categories = arrayOfWords;
        resolve(arrayOfWords);
      })
    })
  }

  

 
  // remove phrase, update DB and arrange by order.
  public removePhrase(phrase: WordClass) {
    this.firebaseProvider.removePhrase(phrase);
  }

  public removePhraseSuperAdmin(phrase: WordClass) {
    this.firebaseProvider.removePhraseSuperAdmin(phrase);
    let promise = this.getPhrasesByName(phrase.name);
    promise.then(()=>{
      this.words.forEach((a:WordClass)=> this.removePhrase(a));
    })
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

  // add to array of viewPerDate the current date of click
  public updateViewsPerDate(phrase: WordClass) {
    if(phrase.viewPerDate===undefined)
    {
      phrase.viewPerDate=[];
    }

    let date=new Date();
    phrase.viewPerDate.push(date);
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
