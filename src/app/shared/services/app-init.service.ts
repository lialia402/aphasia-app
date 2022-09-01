import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { AuthService } from './auth.service';
import { CategoryInfraService } from './category-infra.service';
import { WordInfraService } from './word-infra.service';

const DEFAULT_NUMBER = 372;

@Injectable({
  providedIn: 'root'
})

export class AppInitService {

  public userEmail;
  public load_counter = 0;
  phraseCounter = 0;
  private time: number
  constructor(
  public categoryInfra: CategoryInfraService,
  public wordInfra: WordInfraService,
  public authentication: AuthService,) {
    this.time = 5000;
    this.userEmail = authentication.userData.email;
  }

  // add new category to firebase
  add_new_cat_to_db(category: CategoryClass, phrases: WordClass[], 
    subCat: CategoryClass[], subPhrases: WordClass[][], subFlag: boolean) {
    let catId: string;
    this.categoryInfra.addCategory(category);
    let promise;
    setTimeout(() => {
        promise = this.categoryInfra.getCategoryByName(category.name);
        promise.then((data) => {
        let cat = data;
        cat as CategoryClass;
        catId = cat.id;
        for (let i = 0; i < phrases.length; i++) 
        {
          phrases[i].order = i;
          phrases[i].categoryID = catId;
          this.wordInfra.addPhrase(phrases[i]);
        }
        for (let i = 0; i < subCat.length; i++) 
        {
          subCat[i].order = i;
          subCat[i].parentCategoryID = catId;
          this.add_new_cat_to_db(subCat[i], subPhrases[i], [], [], true)
        }
      })
    }, this.time);
  }

  // fill data base with all relavant categories and words for new users
  newFillDB(){
    setTimeout(async () => {
      await this.categoryInfra.importSuperCategoriesArray();
      this.categoryInfra.getSuperAdminCategories.forEach(async (category) => {
      let words =  await this.wordInfra.getSuperAdminPhrases(category);
      category.id = "";
      category.userEmail = this.userEmail;
      this.add_new_cat_to_db(category,words, [], [], false);
    })
     }, 5000);
  }
}
