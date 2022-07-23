import { Component, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AddCategoryDialogComponent } from '../utils/add-category-dialog/add-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { EditCategoryDialogComponent } from '../utils/edit-category-dialog/edit-category-dialog.component';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  name: any;
  imagePath: any;
  public categories: CategoryClass[];
  constructor(public authService: AuthService, private route: ActivatedRoute, 
    public categoryService: CategoryInfraService, public router: Router ,public dialog: MatDialog, 
    public storageService: StorageInfraProvider,) 
  {
    
  }
  
  //popup the category's 'word's page.
  public openCategoryWords(category: CategoryClass) {
    this.categoryService.setCurrentCategory(category);
    this.categoryService.increaseViews(category);
    this.router.navigate(['word-page']);
  }

  public async getCategories()
  {
    if(this.authService.user.userType=='patient')
    {
      this.categories = this.categoryService.getCategories;
    }
    else
    {
      await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
      this.categories = this.categoryService.getCategories;
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  public deleteCategory(category: CategoryClass) {
    setTimeout(async () => {
      await this.categoryService.removeCategory(category);   
      this.getCategories();  
    }, 500)
  }

  openDialog(category: CategoryClass) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.deleteCategory(category);
      }
    });
  }

  async createImageInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.imagePath,"image");
    return link;
  }

  async addNewCategory() {
    let email:string;
    if(this.authService.user.userType ==='patient')
    {
      email = this.authService.user.email;
    }
    else{
      email = this.authService.patientOfTherapist.email;
    }
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      height: '445px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        // go to storage to add word
        const imageLink = await this.createImageInStorage(result);
        const newCategory = new CategoryClass(result.name, "", imageLink, email,
        "", 0, false, -1, true);
        this.categoryService.addCategory(newCategory);
        this.getCategories();
      }
    });
  }

  async editCategory(category: CategoryClass){
    let email:string;
    if(this.authService.user.userType ==='patient')
    {
      email = this.authService.user.email;
    }
    else{
      email = this.authService.patientOfTherapist.email;
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
            console.log("im here")
            newImageLink= await this.createImageInStorage(result);
            console.log(newImageLink)
          }
        }
        
        this.categoryService.UpdateCategory(category, newName, newImageLink);
        setTimeout(async () => {
          await  
          this.getCategories();  
        }, 500);
      }
    });
  }
}
