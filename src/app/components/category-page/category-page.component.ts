import { Component, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AddCategoryDialogComponent } from '../utils/add-category-dialog/add-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  name: any;
  imagePath: any;
  constructor(public authService: AuthService, private route: ActivatedRoute, public categoryService: CategoryInfraService, public router: Router ,public dialog: MatDialog, public storageService: StorageInfraProvider) 
  {
  }
  
  //popup the category's 'word's page.
  public openCategoryWords(category: CategoryClass) {
    this.categoryService.setCurrentCategory(category);
    this.router.navigate(['word-page']);
  }

  ngOnInit(): void {
  }

  public deleteCategory(category: CategoryClass) {
    setTimeout(async () => {
      await this.categoryService.removeCategory(category);     
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
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      height: '445px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        // go to storage to add word
        console.log(result);
        const imageLink = await this.createImageInStorage(result);
        const newCategory = new CategoryClass(result.name, "", imageLink, this.authService.userData.email,
        "", 0, false, -1, true);
        this.categoryService.addCategory(newCategory);
      }
    });
  }
}
