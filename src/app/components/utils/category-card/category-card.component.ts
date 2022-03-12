import { Component, Input, OnInit } from '@angular/core';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() category: CategoryClass | undefined;
  constructor(public categoryProvider:CategoryInfraService) {
  }


  ngOnInit(): void {
  }
  /**on click method when the user click on a category
   * the method check if to add the category to the common categories list.
   * @param cat the category that clicked
  */
    public categoryOnClick(event:any){
     if(this.category){
     this.categoryProvider.increaseViews(this.category)// update the category views field in the DB
    }
 

}


}
