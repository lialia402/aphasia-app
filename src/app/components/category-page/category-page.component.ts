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
  public categories: CategoryClass[];
  constructor(
    public authService: AuthService, 
    public categoryService: CategoryInfraService,
    public router: Router,
    public dialog: MatDialog, 
    public storageService: StorageInfraProvider,
    public errorService: ErrorInfra,) {}

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
      await this.categoryService.removeCategory(category);   
      this.getCategories();  
    }, 750)
  }

  // verifies the deletion operation
  openDialog(category: CategoryClass) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: "למחוק"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.deleteCategory(category);
      }
    });
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
        //go to storage to add word
        const imageLink = await this.createImageInStorage(result);
        const newCategory = new CategoryClass(result.name, "", imageLink, email,
        "", 0, false, -1, true);
        this.categoryService.addCategory(newCategory);
        setTimeout(async () => {
          await  
          this.getCategories();  
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
        }, 500);
      }
    });
  }

  // update visibility of a category
  updateVisibility(category:CategoryClass){
    this.categoryService.changeVisibility(category);
    this.checkCategoriesVisability();
  }
}
