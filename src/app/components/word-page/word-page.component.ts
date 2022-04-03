import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { WordInfraService } from 'src/app/shared/services/word-infra.service';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-word-page',
  templateUrl: './word-page.component.html',
  styleUrls: ['./word-page.component.scss']
})
export class WordPageComponent implements OnInit {
  public words: WordClass[];
  public category: CategoryClass;

  constructor(private route: ActivatedRoute, public categoryService: CategoryInfraService, public wordService: WordInfraService, public router: Router ,public dialog: MatDialog) {
    this.category=categoryService.getCurrentCategory;
  }

  ngOnInit() {
    debugger;
    this.getwords();
  }

  getwords()
  {
    let promise= this.wordService.getPhrases(this.category);
    promise.then((data) => {
      this.words = data;
      this.wordService.words = data;
    })
  }
  
  public playVoice(word: WordClass) {
    let voice= new Audio();
    voice.src= word.audio;
    voice.load();
    voice.play();
  }

   public deleteWord(word: WordClass) {
    setTimeout(async () => {
      await this.wordService.removePhrase(word);
      this.getwords()      
    }, 500)
    this.wordService.arrangePhrasesByOrder();
    
  }

  openDialog(word: WordClass) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.deleteWord(word);
      }
    });
  }

  public addNewWord() {
    this.router.navigate(['']);
  }
}
