import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInfraService {

  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]> = new Observable<User[]>()

  categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Observable<Category[]> = new Observable<Category[]>()

  phrasesCollection: AngularFirestoreCollection<Phrase>;
  phrases: Observable<Phrase[]> = new Observable<Phrase[]>()

  constructor(public afs: AngularFirestore, public authentication: AutenticationProvider, public error: ErrorProvider) {
    //first import the users collection , mainly to get the current users's attrs.
    this.importUsers()
  }

   //import all users from DB to Observable object
  public importUsers(){
    try{
      this.usersCollection = this.afs.collection<User>('users', ref => ref.orderBy('email', 'desc'));
      this.users = this.usersCollection.snapshotChanges().map(result => {
      return result.map(a => {
          let temp = a.payload.doc.data() as User;
          return temp;
        });
      });
    }
    catch(e){
      this.error.simpleToast("Connection error");
    }
  }


  /**
   * import all categories from DB to Observable object
   * @returns the categories array
   */
  public importCategories()
  {
    //Creating the categories collection of the CURRENT USER!!!!!!!! ha ha
    try{
      this.categoriesCollection = this.afs.collection<Category>('categories', ref => ref.orderBy('order','asc').where('userEmail', '==', this.authentication.user.email));
      this.categories = this.categoriesCollection.snapshotChanges().map(result => {
        return result.map(a => {
          let temp = a.payload.doc.data() as Category;
          temp.id = a.payload.doc.id;
          return temp;
        });
      });
    }
    catch(e){
      this.error.simpleToast("Connection error");
    }
  }


 /**
   * import all phrases from DB to observable object.
   * @returns the phrases array
   */

  public importPhrases(category: Category)
  {
    try{
      //Creating the phrases collection of specific category of current user
      this.phrasesCollection = this.afs.collection<Phrase>('phrases', ref => ref.orderBy('order','asc').where('categoryID','==',category.id));
      //this.phrasesCollection = this.afs.collection<Phrase>('phrases', ref => ref.orderBy('name', 'asc'));
      this.phrases = this.phrasesCollection.snapshotChanges().map(result => {
        return result.map(a => {
          let temp = a.payload.doc.data() as Phrase;
          temp.id = a.payload.doc.id;
          return temp;
        });
      });
    }
      catch(e){
        this.error.simpleToast("Connection error");
      }
  }

  
  get getUsersObservable() {
    return this.users
  }

  addUser(user: User) {
    return this.usersCollection.add(User.toObject(user));
  }

  get getCategoriesObservable() {
    return this.categories;
  }

  addCategory(category: Category) {    
    return this.categoriesCollection.add(Category.toObject(category)).then(function(){
    }).catch(function(e){
      this.error.simpleToast("הוספה נכשלה");
    })
  }

  removeCategory(category: Category){
    this.categoriesCollection.doc(category.id ).delete().then(function() {
  }).catch(function(e) {
      this.error.simpleToast("מחיקה נכשלה");
  });
  }

  get getPhrasesObservable() {
    return this.phrases;
  }

  addPhrase(phrase: Phrase) {
    return this.phrasesCollection.add(Phrase.toObject(phrase)).then(function(){
    }).catch(function(e){
      this.error.simpleToast("הוספה נכשלה");
    })
  }

  removePhrase(phrase: Phrase){
    this.phrasesCollection.doc(phrase.id).delete().then(function() {
  }).catch(function(e) {
      this.error.simpleToast("מחיקה נכשלה");
  });
  }

    /**
   * Update fields of a document without overwriting the entire document.
   * @param phrase, the updated local phrase, to update the db
   */
  updatePhrase(phrase: Phrase){
    this.afs.doc('phrases/' + phrase.id).update(phrase);
  }

    /**
   * Update fields of a document without overwriting the entire document.
   * @param category, the updated local category, to update the db
   */
  updateCategory(category: Category){
    this.afs.doc('categories/' + category.id).update(category);
  }
}
