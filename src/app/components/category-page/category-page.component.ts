import { Component, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

 // public phrasesPage: PhrasesPage;

  constructor(public categoryService: CategoryInfraService) {
  }

  //popup the category's phrases's page.
  public openCategoryPhrases(category: CategoryClass) {
     ///TODO ADD WORDS ROUTE
  }

  ngOnInit(): void {
  }

}
