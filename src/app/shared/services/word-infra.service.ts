import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordInfraService {

  phrases: any;
  categoryName: any;

  constructor(public firebaseProvider: FirebaseProvider, public error: ErrorProvider) {
  }

  //first,calling import of all category's phrases.
  //then, create a Promise object that active only when arrayOfPhrases filled up once.
  //Promise return to an async function that handle with him.
  //subscribe listen to the db while the app is alive.
  //note that there is no relation between Promise object to  method. 
  public getPhrases(category: Category): Promise<Phrase[]> {
    this.firebaseProvider.importPhrases(category);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getPhrasesObservable.subscribe(arrayOfPhrases => {
        resolve(arrayOfPhrases);
      })
    })
  }

  /**
  * for handling the promise returned, use "promise.then((data) =>{'data' hold the wanted phrase...})"
  * for catching error use "promise.then().catch(e){...handling error...}"
  * @param n name of phrase
  * @returns Promise object
  */
  public getPhraseByName(n: string): Promise<Phrase> {
    return new Promise((resolve, reject) => {
      try {
        let temp = this.phrases.find(phrs => phrs.name == n);
        resolve(temp)
      }
      catch (e) {
        this.error.simpleToast("The wanted category doesn't exist")
      }
    })
  }

  /**
   * Rearrange the current phrases array by order propery.
   * usually used after adding or removing of phrase. 
   * MAKE SURE you update the local prhase array here in the provider
   *  or you are going to have a bad time
   */
  public arrangePhrasesByOrder() {
    for (var i = 0; i < this.phrases.length; i++) {
      this.setOrder(this.phrases[i], i);
    }
  }

  /**
   * for handling the promise returned, use "promise.then((data) =>{'data' hold the wanted phrase...})"
   * for catching error use "promise.then().catch(e){...handling error...}"
   * @param n name of phrase
   * @returns Promise object
   */
  public getPhraseById(id: string): Promise<Phrase> {
    return new Promise((resolve, reject) => {
      try {
        let temp = this.phrases.find(phrs => phrs.id === id)
        resolve(temp)
      }
      catch (e) {
        this.error.simpleToast("The wanted category doesn't exist")
      }
    })
  }

  /**
   * add phrase, update DB and arrange by order.
   * if addPhrase called from App-Builder don't arrange by order.
   */
  public addPhrase(phrase: Phrase, callFromAppBuilder = false) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.addPhrase(phrase).then(() => {
        resolve(phrase);
      });
    })
    //if (callFromAppBuilder == false)
    //this.arrangePhrasesByOrder();
  }

  /**
 * remove phrase, update DB and arrange by order.
 * 
 */
  public removePhrase(phrase: Phrase) {
    this.firebaseProvider.removePhrase(phrase);
    let favoriteProvider = new FavoriteProvider(HomePage.favClass);
    favoriteProvider.remove_fav_phrases(phrase);
    favoriteProvider.remove_from_commom_phrases(phrase);
    //this.arrangePhrasesByOrder();
  }

  //SETTERS
  public setName(phrase: Phrase, newName: string) {
    phrase.name = newName;
    this.firebaseProvider.updatePhrase(phrase)
  }
  public setImageUrl(phrase: Phrase, newURL: string) {
    phrase.imageURL = newURL;
    this.firebaseProvider.updatePhrase(phrase)
  }
  public setAudioUrl(phrase: Phrase, newURL: string) {
    phrase.audio = newURL;
    this.firebaseProvider.updatePhrase(phrase)
  }
  public setCategoryID(phrase: Phrase, newCategoryParent: string) {
    phrase.categoryID = newCategoryParent;
    this.firebaseProvider.updatePhrase(phrase)
  }
  public setIsFav(phrase: Phrase, isFav: boolean) {
    phrase.isFav = isFav;
    this.firebaseProvider.updatePhrase(phrase);
  }
  //each time a category has chosen, her views increase by 1.
  public increaseViews(phrase: Phrase) {
    phrase.views++;
    this.firebaseProvider.updatePhrase(phrase)
  }
  public setOrder(phrase: Phrase, order: number) {
    phrase.order = order;
    this.firebaseProvider.updatePhrase(phrase);
  }
  public updatePhrase(phrase: Phrase) {
    this.firebaseProvider.updatePhrase(phrase)
  }
  public changeVisibility(phrase: Phrase) {
    phrase.visibility = !phrase.visibility;
    this.firebaseProvider.updatePhrase(phrase);
  }
}
