import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, OperatorFunction, pipe } from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { map } from "rxjs/operators"; 
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { AuthService } from './auth.service';
import { User } from './user';
import { UserClass } from '../models/user-class.model';
import firebase from 'firebase/compat/app';
import { GameResult } from '../models/game-result.model';
import { Game } from '../models/game.model';
import { GameSettings } from '../models/game-settings.model';
import { TestInfo } from '../models/test-info.model';
import { TestResult } from '../models/test-result.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInfraService {

  // user collection
  usersCollection: AngularFirestoreCollection<User> | undefined;
  users: Observable<User[]> = new Observable<User[]>()

  // categories collection
  categoriesCollection: AngularFirestoreCollection<CategoryClass> | undefined;
  categories: Observable<CategoryClass[]> = new Observable<CategoryClass[]>()

  // super admin categories collection 
  superAdminCategoriesCollection: AngularFirestoreCollection<CategoryClass> | undefined;
  superAdminCategories: Observable<CategoryClass[]> = new Observable<CategoryClass[]>()

  // words collection
  wordsCollection: AngularFirestoreCollection<WordClass> | undefined;
  words: Observable<WordClass[]> = new Observable<WordClass[]>()

  // super admin words collection
  superAdminWordsCollection: AngularFirestoreCollection<WordClass> | undefined;
  superAdminWords: Observable<WordClass[]> = new Observable<WordClass[]>()

  // patient list collection
  patientsCollection: AngularFirestoreCollection<User> | undefined;
  patients: Observable<User[]> = new Observable<User[]>()

  // game result collection
  gameResultsCollection: AngularFirestoreCollection<GameResult> | undefined;
  gameResults: Observable<GameResult[]> = new Observable<GameResult[]>()

  // game collection
  gamesCollection: AngularFirestoreCollection<Game> | undefined;
  games: Observable<Game[]> = new Observable<Game[]>();

  // game settings collection
  gameSettingsCollection: AngularFirestoreCollection<GameSettings> | undefined;
  gameSettings: Observable<GameSettings[]> = new Observable<GameSettings[]>();

  // test info collection
  testInfoCollection:AngularFirestoreCollection<TestInfo> | undefined;
  testInfo:Observable<TestInfo[]> = new Observable<TestInfo[]> ();

  // test result collection
  testResultCollection:AngularFirestoreCollection<TestResult> | undefined;
  testResult:Observable<TestResult[]> = new Observable<TestResult[]> ();


  constructor(public afs: AngularFirestore, public authentication: AuthService,) {
    //first import the users collection , mainly to get the current users's attrs.
    this.importUsers()
  }

   //import all users from DB to Observable object
   public importUsers(){
    try{
      this.usersCollection = this.afs.collection<User>('users', ref => ref.orderBy('email', 'desc'));
      this.users = this.usersCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as User;
          return temp;
        });
      }));
    }
    catch(e){
     console.log("Connection error");
    }
  }

  // import all game results
  public importGameResults(){
    try{
      this.gameResultsCollection = this.afs.collection<GameResult>('gameResults', ref => ref.where('userEmail', '==', this.authentication.userData.email));
      this.gameResults = this.gameResultsCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as GameResult;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all game settings
  public importGameSettings(){
    try{
      this.gameSettingsCollection = this.afs.collection<GameSettings>('gameSettings', ref => ref.where('userEmail', '==', this.authentication.userData.email));
      this.gameSettings = this.gameSettingsCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as GameSettings;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all game settings by email
  public importGameSettingsByEmail(email:string){
    try{
      this.gameSettingsCollection = this.afs.collection<GameSettings>('gameSettings', ref => ref.where('userEmail', '==', email));
      this.gameSettings = this.gameSettingsCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as GameSettings;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all test result
  public importTestResult(){
    try{
      this.testResultCollection = this.afs.collection<TestResult>('testResults', ref => ref.where('userEmail', '==', this.authentication.userData.email));
      this.testResult = this.testResultCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as TestResult;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import test result by email
  public imporTestResultByEmail(email:string){
    try{
      this.testResultCollection = this.afs.collection<TestResult>('testResults', ref => ref.where('userEmail', '==', email));
      this.testResult = this.testResultCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as TestResult;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import game result by email
  public importGameResultsByEmail(email:string){
    try{
      this.gameResultsCollection = this.afs.collection<GameResult>('gameResults', ref => ref.where('userEmail', '==', email));
      this.gameResults = this.gameResultsCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as GameResult;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all games
  public importGames(){
    try{
      this.gamesCollection = this.afs.collection<Game>('games', ref => ref.where('userEmail', '==', this.authentication.userData.email));
      this.games = this.gamesCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as Game;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import test info
  public importTestInfo(){
    try{
      this.testInfoCollection = this.afs.collection<TestInfo>('tests', ref => ref.where('userEmail', '==', this.authentication.userData.email));
      this.testInfo = this.testInfoCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as TestInfo;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import games by email
  public importGamesByEmail(email:string){
    try{
      this.gamesCollection = this.afs.collection<Game>('games', ref => ref.where('userEmail', '==', email));
      this.games = this.gamesCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as Game;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import tests by email
  public importTestsByEmail(email:string){
    try{
      this.testInfoCollection = this.afs.collection<TestInfo>('tests', ref => ref.where('userEmail', '==', email));
      this.testInfo = this.testInfoCollection.snapshotChanges().pipe(map((result:any[]) => {
      return result.map(a => {
          let temp = a.payload.doc.data() as TestInfo;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }


  // import super admin categories
  public importSuperAdminCategories()
  {
    try{
      this.superAdminCategoriesCollection = this.afs.collection<CategoryClass>('superAdminCategories', ref => ref.orderBy('order','asc'));
      this.superAdminCategories = this.superAdminCategoriesCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as CategoryClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import super admin words
  public importSuperAdminWords(category: CategoryClass)
  {
    try{
      this.superAdminWordsCollection = this.afs.collection<WordClass>('superAdminWords', ref => ref.orderBy('order','asc').where('categoryID','==',category.id));
      this.superAdminWords = this.superAdminWordsCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as WordClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all categories
  public importCategories()
  {
    try{
      this.categoriesCollection = this.afs.collection<CategoryClass>('categories', ref => ref.orderBy('order','asc').where('userEmail', '==', this.authentication.userData.email));
      this.categories = this.categoriesCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as CategoryClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import all categories by name
  public importCategoriesByName(name:string)
  {
    try{
      this.categoriesCollection = this.afs.collection<CategoryClass>('categories', ref => ref.orderBy('order','asc').where('name', '==', name));
      this.categories = this.categoriesCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as CategoryClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import categories by email
  public importCategoriesByEmail(email:string)
  {
    try{
      this.categoriesCollection = this.afs.collection<CategoryClass>('categories', ref => ref.orderBy('order','asc').where('userEmail', '==', email));
      this.categories = this.categoriesCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as CategoryClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
    catch(e){
      console.log("Connection error");
    }
  }

  // import words
  public importwords(category: CategoryClass)
  {
    try{
      //Creating the words collection of specific category of current user
      this.wordsCollection = this.afs.collection<WordClass>('words', ref => ref.orderBy('order','asc').where('categoryID','==',category.id));
      this.words = this.wordsCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as WordClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
      catch(e){
        console.log("Connection error");
      }
  }

  // import words by email
  public importwordsByName(name: string)
  {
    try{
      //Creating the words collection of specific category of current user
      this.wordsCollection = this.afs.collection<WordClass>('words', ref => ref.orderBy('order','asc').where('name','==',name));
      this.words = this.wordsCollection.snapshotChanges().pipe(map((result:any[]) => {
        return result.map(a => {
          let temp = a.payload.doc.data() as WordClass;
          temp.id = a.payload.doc.id;
          return temp;
        });
      }));
    }
      catch(e){
        console.log("Connection error");
      }
  }


  // add test result to firebase
  addTestResult(testResult: TestResult) {
    return this.testResultCollection?.add(TestResult.toObject(testResult));
  }

  // add user to firebase
  addUser(user: User) {
    return this.usersCollection?.add(UserClass.toObject(user));
  }

  // add ctaegory to firebase
  addCategory(category: CategoryClass) {   
    return this.categoriesCollection?.add(CategoryClass.toObject(category)).then(function(){
    }).catch((e) =>{
         console.log("הוספה נכשלה");
     })
  }

  // add category to super admin firebase
  addSuperAdminCategory(category: CategoryClass) {   
    return this.superAdminCategoriesCollection?.add(CategoryClass.toObject(category)).then(function(){
    }).catch((e) =>{
         console.log("הוספה נכשלה");
     })
  }

  // add word to super admin firebase
  addSuperAdminWord(word: WordClass) {   
    return this.superAdminWordsCollection?.add(WordClass.toObject(word)).then(function(){
    }).catch((e) =>{
         console.log("הוספה נכשלה");
     })
  }

  // add test info to firebase
  addTestInfo(testInfo:TestInfo)
  {
    return this.testInfoCollection?.add(TestInfo.toObject(testInfo)).then(function(){
    }).catch((e) =>{
         console.log("הוספה נכשלה");
     })
  }

  // add game settingss to firebase
  addGameSettings(category: GameSettings) {   
    return this.gameSettingsCollection?.add(GameSettings.toObject(category)).then(function(){
    }).catch((e) =>{
         console.log("הוספה נכשלה");
     })
  }

  // add word to firebase
  addWord(word: WordClass) {
    return this.wordsCollection?.add(WordClass.toObject(word)).then(function(){
    }).catch((e) =>{
        console.log("הוספה נכשלה");
    })
  }

  // add game result to firebase
  addGameResult(gameResult: GameResult) {
    return this.gameResultsCollection?.add(WordClass.toObject(gameResult)).then(function(){
    }).catch((e) =>{
        console.log("הוספה נכשלה");
    })
  }

  // add game to firebase
  addGame(game: Game) {
    return this.gamesCollection?.add(WordClass.toObject(game)).then(function(){
    }).catch((e) =>{
        console.log("הוספה נכשלה");
    })
  }

  // add patient to firebase
  addPatient(email: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc( `users/${this.authentication.user.uid}` );
    const addPatient= firebase.firestore.FieldValue.arrayUnion(email) as unknown as string[];
    userRef.update({ listOfPatients: addPatient });

  }

  // remove patient from firebase
  removePatient(email:string)
  {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc( `users/${this.authentication.user.uid}` );
    const addPatient= firebase.firestore.FieldValue.arrayRemove(email) as unknown as string[];
    userRef.update({ listOfPatients: addPatient });
  }

  // remove setitngs from firebase
  removeSettings(gameSettings: GameSettings){
    this.gameSettingsCollection?.doc(gameSettings.id ).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  // remove category fro, firebase
  removeCategory(category: CategoryClass){
    this.categoriesCollection?.doc(category.id ).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  // remove category from category from firebase
  removeSuperAdminCategory(category: CategoryClass){
    this.superAdminCategoriesCollection?.doc(category.id ).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  // remove test info from firebase
  removeTestInfo(test:TestInfo)
  {
    this.testInfoCollection?.doc(test.id).delete().then(function() {
    }).catch((e) => {
      console.log("מחיקה נכשלה");
    });
  }

  // remove game from firebase
  removeGame(game: Game){
    this.gamesCollection?.doc(game.id).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  
  removePhrase(phrase: WordClass){
    this.wordsCollection?.doc(phrase.id).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  removePhraseSuperAdmin(phrase: WordClass){
    this.superAdminWordsCollection?.doc(phrase.id).delete().then(function() {
  }).catch((e) => {
    console.log("מחיקה נכשלה");
  });
  }

  updateWord(word: WordClass){
    this.afs.doc('words/' + word.id).update(WordClass.toObject(word));
  }

  updateTestInfo(test:TestInfo)
  {
    this.afs.doc('tests/' + test.id).update(TestInfo.toObject(test));
  }

  updateCategory(category: CategoryClass){
    this.afs.doc('categories/' + category.id).update(CategoryClass.toObject(category));
  }

  updateResult(result: GameResult){
    this.afs.doc('gameResults/' + result.id).update(GameResult.toObject(result));
  }

  updateGameSettings(result: GameSettings){
    this.afs.doc('gameSettings/' + result.id).update(result);
  }

  updateGameInfo(gameSettings: GameSettings) {
    const userRef: AngularFirestoreDocument<GameSettings> = this.afs.doc( `gameSettings/${gameSettings.id}` );
    return userRef.set(GameSettings.toObject(gameSettings));

  }

  // getters

  get getUsersObservable() {
    return this.users
  }

  get getTestResultsObservable() {
    return this.testResult
  }
 
  get getCategoriesObservable() {
    return this.categories;
  }

  get getSuperAdminCategoriesObservable() {
    return this.superAdminCategories;
  }

  get getSuperAdminWordsObservable() {
    return this.superAdminWords;
  }

  get getwordsObservable() {
    return this.words;
  }

  get getGameResultsObservable() {
    return this.gameResults;
  }

  get getGamesObservable() {
    return this.games;
  }

  get getTestInfosObservable() {
    return this.testInfo;
  }

  get getGameSettingsObservable() {
    return this.gameSettings;
  }

}


