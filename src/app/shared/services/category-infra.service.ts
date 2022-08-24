import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';
import { CategoryClass } from '../models/category-class.model';
import { AuthService } from './auth.service';
import { ErrorInfra } from './error-infra.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { UserInfaService } from './user-infa.service';
import { WordInfraService } from './word-infra.service';

@Injectable({
  providedIn: 'root'
})

export class CategoryInfraService {
  public currentCategory: CategoryClass;
  public categories: any[]=[];
  public superAdminCategories: any[]=[];
  private allUserPhrases : any[]= [];
  private subCategories : any[]= []; //tdl

  // import categories collection from database and initialize categories
  constructor(
    public firebaseProvider: FirebaseInfraService,
    public error: ErrorInfra,
    public authentication: AuthService,
    public wordInfraService: WordInfraService,
    public userInfra: UserInfaService) {
    if (authentication.afAuth.currentUser!==null)
      this.updateCategoriesArray();
      this.importSuperCategoriesArray();
  }

  // updating the categories and refreshing the page, the method return a Promise object
  public updateCategoriesArray(): Promise<CategoryClass[]> {
    this.allUserPhrases = []
    this.firebaseProvider.importCategories();
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getCategoriesObservable.subscribe(a => {
        this.categories = a;
        this.categories.forEach(element1 => {

          //initilize all user's phrases local array
          let promise = this.wordInfraService.getPhrases(element1);
          promise.then((data) => {
            data.forEach(element2 => {
              if (!this.allUserPhrases.some(phrase => phrase.id == element2.id))
                this.allUserPhrases.push(element2);
            });
          })
        })
        this.categories = a.filter(cat => cat.parentCategoryID == "");
        resolve(this.subCategories = a.filter(cat => cat.parentCategoryID != ""))
      })
    })
  }

  // updating the categories and refreshing the page, the method return a Promise object
  public importSuperCategoriesArray(): Promise<CategoryClass[]> {
    this.firebaseProvider.importSuperAdminCategories();
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getSuperAdminCategoriesObservable.subscribe(arrayOfWords => {
        this.superAdminCategories = arrayOfWords;
        resolve(arrayOfWords);
      })
    })
  }

  // update category array by user's email 
  public updateCategoriesArrayByEmail(email:string): Promise<CategoryClass[]> {
    this.allUserPhrases = []
    this.firebaseProvider.importCategoriesByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getCategoriesObservable.subscribe(a => {
        this.categories = a;
        this.categories.forEach(element1 => {
          
          //initilize all user's phrases local array
          let promise = this.wordInfraService.getPhrases(element1);
          promise.then((data) => {
            data.forEach(element2 => {
              if (!this.allUserPhrases.some(phrase => phrase.id == element2.id))
                this.allUserPhrases.push(element2);
            });
          })
        })
        this.categories = a.filter(cat => cat.parentCategoryID == "");
        resolve(this.subCategories = a.filter(cat => cat.parentCategoryID != ""))
      })
    })
  }
  
  // rearrange all categories by new order.
  public arrangeCategoriesByOrder() {
    for (var i = 0; i < this.categories.length; i++) {
      this.setOrder(this.categories[i], i);
    }

    for (var i = 0; i < this.subCategories.length; i++) {
      this.setOrder(this.subCategories[i], i);
    }
  }

  // geeters
  public get getCategories() {
    return this.categories;
  }

  public get getSuperAdminCategories() {
    return this.superAdminCategories;
  }



  public get getAllUserPhrases() {
    return this.allUserPhrases;
  }

  public get getCurrentCategory() {
    return this.currentCategory;
  }
  
  public getCategoryByName(n: string): Promise<CategoryClass> {
    return new Promise((resolve, reject) => {
      try {
        let temp = this.categories.find(cat => cat.name == n);
        if (temp == undefined)
          reject("category undefined");
        else
          resolve(temp);
      }
      catch (e) {
        console.log(e)
      }
    })
  }

  // add category to firebase
  public addCategory(category: CategoryClass, callFromAppBuilder = false): Promise<void>|undefined 
  {
    let promise;
    if(callFromAppBuilder == false) {
      if(this.authentication.user.userType==='superAdmin')
      {
        promise = this.firebaseProvider.addSuperAdminCategory(category);
        this.updateCategoriesArray().then(res => {
        }).catch((err) =>{
          this.error.openSimleSnackBar('ההוספה נכשלה', 'סגור');
        })

        let patients = this.userInfra.getAllPatients();
        for(let i=0;i<patients.length;i++){
          category.id = "";
          category.visibility = false;
          category.userEmail = patients[i].email;
          this.firebaseProvider.addCategory(category);
        }
      }
      else{
        promise = this.firebaseProvider.addCategory(category);
        this.updateCategoriesArrayByEmail(this.authentication.patientOfTherapist.email).then(res => {
        }).catch((err) =>{
          this.error.openSimleSnackBar('ההוספה נכשלה', 'סגור');
        })
      }
    }
    return promise;
  }

  // tdl remove category from firebase
  public removeCategory(category: CategoryClass): Promise<any> {
    return new Promise((resolve, reject) => {
      let promise = this.wordInfraService.getPhrases(category);
      promise.then((data) => {
        let phrases = data;
        if (category.parentCategoryID == "") {
          //if the wanted remove category isn't a sub-category.
          let subCategories = this.subCategories.filter(cat => cat.parentCategoryID == category.id);
          subCategories.forEach(element => {
           // favoriteProvider.remove_fav_cat(element);
           // favoriteProvider.remove_from_commom_cat(element);
            let promise2 = this.wordInfraService.getPhrases(element);//remove the sub-categories's phrases
            promise2.then((data) => {
              let phrases2 = data;
              phrases2.forEach(element => {
                this.firebaseProvider.removePhrase(element);
               // favoriteProvider.remove_fav_phrases(element)
               // favoriteProvider.remove_from_commom_phrases(element)
              })
            });
            this.firebaseProvider.removeCategory(element);
          })
        }

        phrases.forEach(element => {
          this.firebaseProvider.removePhrase(element);
        });

        this.firebaseProvider.removeCategory(category);
        let promise = this.updateCategoriesArray();
        promise.then(() => {
          resolve(true);
        })
      })
    })
  }

  // update category in firebase
  UpdateCategory(category: CategoryClass, name:string, image:string) {
    const userRef: AngularFirestoreDocument<any> = this.firebaseProvider.afs.doc(
      `categories/${category.id}`
    );

    let newCategory: any;
    newCategory= {
      name: name, 
      id: category.id,
      imageURL: image,
      userEmail: category.userEmail, 
      parentCategoryID: category.parentCategoryID, 
      views: category.views,
      isFav: category.isFav,
      order: category.order,
      visibility: category.visibility,
  };

    userRef.set(newCategory, {
      merge: true,
    });
    this.updateCategoriesArray().then(res => {
    }).catch((err) =>{
      console.log(err);
    })
  }

  // seeters
  public setCurrentCategory(category: CategoryClass) {
    this.currentCategory = category;
    this.wordInfraService.currentCategory = category;
  }

  public setName(category: CategoryClass, newName: string) {
    category.name = newName;
    this.firebaseProvider.updateCategory(category)
  }

  public setUrl(category: CategoryClass, newURL: string) {
    category.imageURL = newURL;
    this.firebaseProvider.updateCategory(category)
  }

  public setParentCategoryID(category: CategoryClass, newCategoryParent: string) {
    category.parentCategoryID = newCategoryParent;
    this.firebaseProvider.updateCategory(category)
  }

  public setIsFav(category: CategoryClass, isFav: boolean) {
    category.isFav = isFav;
    this.firebaseProvider.updateCategory(category)
  }

  // each time a category is chosen, its views increase by 1.
  public increaseViews(category: CategoryClass) {
    category.views++;
    this.firebaseProvider.updateCategory(category)
  }

  // add to array of viewPerDate the current date of click
  public updateViewsPerDate(category: CategoryClass) {
    if(category.viewPerDate===undefined)
    {
      category.viewPerDate=[];
    }
    let date=new Date();
    category.viewPerDate.push(date);
    this.firebaseProvider.updateCategory(category)
  }

  public updateCategory(category: CategoryClass) {
    this.firebaseProvider.updateCategory(category);
  }

  public setOrder(category: CategoryClass, order: number) {
    category.order = order;
    this.firebaseProvider.updateCategory(category);
  }

  public changeVisibility(category: CategoryClass) {
    category.visibility = !category.visibility;
    this.firebaseProvider.updateCategory(category);
  }
}
