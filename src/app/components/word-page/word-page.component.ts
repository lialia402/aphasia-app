import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { WordInfraService } from 'src/app/shared/services/word-infra.service';

@Component({
  selector: 'app-word-page',
  templateUrl: './word-page.component.html',
  styleUrls: ['./word-page.component.scss']
})
export class WordPageComponent implements OnInit {
  public words: WordClass[];
  public category: CategoryClass;

  constructor(private route: ActivatedRoute, public categoryService: CategoryInfraService, public wordService: WordInfraService) {
    this.category=categoryService.getCurrentCategory;
  }

  ngOnInit() {
    debugger;
    let promise= this.wordService.getPhrases(this.category);
    promise.then((data) => {
      this.words = data;
      this.wordService.words = data;
    })
  }
  
  public playVoice(words: WordClass) {
    //ToDo
  }
}
