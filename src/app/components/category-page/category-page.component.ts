import { Component, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AddCategoryDialogComponent } from '../utils/add-category-dialog/add-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EditCategoryDialogComponent } from '../utils/edit-category-dialog/edit-category-dialog.component';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})

export class CategoryPageComponent implements OnInit {
  name: any;
  imagePath: any;
  isTherapist: boolean;
  isSuperAdmin:boolean;
  isCategoryDisabled: boolean = false;
  isCategoryEnabled: boolean = false;
  isSuperAdminCategoryDisabled: boolean = false;
  public categories: CategoryClass[];
  constructor(
    public authService: AuthService, 
    public categoryService: CategoryInfraService,
    public router: Router,
    public dialog: MatDialog, 
    public storageService: StorageInfraProvider,
    public errorService: ErrorInfra,
    private _snackBar: MatSnackBar,
    public testService: EquizInfraService,
    public gameService: GameInfraService) {}

  // move to category's 'word's page. in addition increase the views
  public openCategoryWords(category: CategoryClass) {
    this.categoryService.setCurrentCategory(category);
    if(this.authService.user.userType === 'patient')
    {
      this.categoryService.increaseViews(category);
      this.categoryService.updateViewsPerDate(category);
    }
    this.router.navigate(['word-page']);
  }
  public exitApp(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: {name: "להתנתק"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.authService.SignOut();
        this.router.navigate(['sign-in']).then(() => {
          window.location.reload();
        });
      }
    });
  }
  
  // Check if patient has categories disabled by therpist
  public isTherpistHasDisableCategory(){
    const checkDisabledCat = (obj: CategoryClass) => obj.visibility === false &&(!this.isSuperAdminCategory(obj.name));
    return this.categories.some(checkDisabledCat);
  }

  // load the relavant categories
  public async getCategories()
  {
    if(this.authService.user.userType=='patient')
    {
      this.categories = this.categoryService.getCategories;
      this.checkCategoriesVisability();
    }
    else if(this.authService.user.userType=='admin')
    {
      await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
      this.categories = this.categoryService.getCategories;
      this.checkCategoriesVisability();
      this.checkSuperCategoriesVisability();
    }
    else if(this.authService.user.userType=='superAdmin'){
      this.categories = this.categoryService.getSuperAdminCategories;
    }
  }

  // check if there are visible and invisible categories
  checkCategoriesVisability(){
    const checkEnabledCat = (obj: CategoryClass) => obj.visibility === true;
      this.isCategoryEnabled = this.categories.some(checkEnabledCat);
      const checkDisabledCat = (obj: CategoryClass) => obj.visibility === false;
      this.isCategoryDisabled = this.categories.some(checkDisabledCat);
  }

  checkSuperCategoriesVisability(){
    const checkSuperAdminCat =  (obj: CategoryClass) => obj.visibility === false 
    && obj.name !== 'אוכל'
    && obj.name !== 'מספרים'
    && obj.name !== 'חגים'
    && obj.name !== 'אירועים'
    && obj.name !== 'מקומות'
    && obj.name !== 'אברי גוף'
    && obj.name !== 'רגשות'
    && obj.name !== 'אנשי מקצוע'
    && obj.name !== 'חגים'
    && this.categoryService.superAdminCategories.some(a=> a.name === obj.name);

    this.isSuperAdminCategoryDisabled = this.categories.some(checkSuperAdminCat);
  }

  // check if there are categories of the admin
  isSuperAdminCategory(name:string)
  {
    return name !== 'אוכל'
    && name !== 'מספרים'
    && name !== 'חגים'
    && name !== 'אירועים'
    && name !== 'מקומות'
    && name !== 'אברי גוף'
    && name !== 'רגשות'
    && name !== 'אנשי מקצוע'
    && name !== 'חגים'
    && this.categoryService.superAdminCategories.some(a=> a.name === name);
  }

  ngOnInit(): void {
    setTimeout(async () => {  
      await this.getCategories();  
    }, 500)
    this.isTherapist = this.authService.user.userType === 'admin';
    this.isSuperAdmin = this.authService.user.userType === 'superAdmin';
  }

  // delete the specific category and the words belongs to it
  public deleteCategory(category: CategoryClass) {
    setTimeout(async () => {
      if(this.authService.user.userType==='superAdmin')
      {
        await this.categoryService.removeCategorySuperAdmin(category);
      }
      else{
        await this.categoryService.removeCategory(category); 
      }
      this.getCategories();  
    }, 1000)
  }

  // verifies the deletion operation
  openDialog(category: CategoryClass) {
    let needToDisableActiveTest = this.checkActiveTest(category);
    let message = needToDisableActiveTest? "למחוק, שים לב מחיקה זו תהפוך את המבחן הפעיל כעת ללא פעיל" : "למחוק";
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: message}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.deleteCategory(category);
        if(needToDisableActiveTest)
        {
          this.testService.updateDisActivateTest(this.testService.getActiveTest());
        }
        this._snackBar.open('המחיקה הושלמה בהצלחה', 'סגור');
      }
    });
  }

  // check if the active test containes the category we want to delete
  checkActiveTest(category: CategoryClass)
  {
    if(this.testService.getActiveTest() === undefined){
      return false;
    }

    else{
      let wordsArray = this.categoryService.getAllUserPhrases.filter(word => word.categoryID === category.id).map(word => word.name);
      return this.testService.getActiveTest().wordList.some(r=> wordsArray.includes(r));
    }
  }

  // upload the new image to firebase
  async createImageInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.imagePath,"image");
    return link;
  }

  async addNewCategory() {
    let email:string;
    if(this.authService.user.userType ==='admin')
    {
      email = this.authService.patientOfTherapist.email;
    }
    else{
      email = this.authService.user.email;
    }
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      height: '445px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        if(result.name === undefined)
        {
          this.errorService.openSimleSnackBar('לא הוזן שם', 'סגור');
        }
        else if(result.imagePath === undefined)
        {
          this.errorService.openSimleSnackBar('לא נבחרה תמונה', 'סגור');
        }
        else{
        // go to storage to add word
        const imageLink = await this.createImageInStorage(result);
        const newCategory = new CategoryClass(result.name, "", imageLink, email,
        "", 0, false, -1, true);
        this.categoryService.addCategory(newCategory);
        setTimeout(async () => {
          await  
          this.getCategories();
          this._snackBar.open('ההוספה הושלמה בהצלחה', 'סגור');  
        }, 500);
        }
      }
    });
  }

  // edit category: Change one or more of the following details: category name, category image
  async editCategory(category: CategoryClass){
    let email:string;
    if(this.authService.user.userType ==='admin')
    {
      email = this.authService.patientOfTherapist.email;
    }
    else{
      email = this.authService.user.email;
    }
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      height: '445px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath}
    });
    
     dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        let newName;
        let newImageLink;
        // go to storage to edit category
        if((result.imagePath!==undefined || result.name!==undefined))
        {
          newName= result.name===undefined? category.name:result.name;
          newImageLink=category.imageURL;
          if(result.imagePath!==undefined)
          {
            newImageLink= await this.createImageInStorage(result);
          }
        }

        else{
          this.errorService.openSimleSnackBar('לא בוצעו שינויים', 'סגור');
        }
        
        this.categoryService.UpdateCategory(category, newName, newImageLink);
        setTimeout(async () => {
          await  
          this.getCategories();  
          this._snackBar.open('העריכה הושלמה בהצלחה', 'סגור');
        }, 500);
      }
    });
  }

  // update visibility of a category
  updateVisibility(category:CategoryClass){
    this.categoryService.changeVisibility(category);
    this.checkCategoriesVisability();
    this.checkSuperCategoriesVisability();
  }
}
