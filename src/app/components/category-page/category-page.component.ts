import { Component, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

 // public phrasesPage: PhrasesPage;

  constructor(public categoryService: CategoryInfraService, public router: Router) {
  }

  //popup the category's phrases's page.
  public openCategoryPhrases(category: CategoryClass) {
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

}
