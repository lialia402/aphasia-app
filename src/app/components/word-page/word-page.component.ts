import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { WordInfraService } from 'src/app/shared/services/word-infra.service';
import { AddDialogComponent } from '../utils/add-dialog/add-dialog.component';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-word-page',
  templateUrl: './word-page.component.html',
  styleUrls: ['./word-page.component.scss']
})
export class WordPageComponent implements OnInit {
  public words: WordClass[];
  public category: CategoryClass;
  public name:string;
  public imagePath:any;
  public audioPath:any;
  public imageLink:any;

  constructor(private route: ActivatedRoute, public categoryService: CategoryInfraService, public wordService: WordInfraService, public router: Router ,public dialog: MatDialog, public storageService: StorageInfraProvider) {
    this.category=categoryService.getCurrentCategory;
  }

  ngOnInit() {
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
    this.wordService.increaseViews(word);
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

  async createImageInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.imagePath,"image");
    return link;
  }

  async createAudioInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.audioPath,"audio");
    return link;
  }

  async addNewWord() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      height: '560px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath, audioPath: this.audioPath}
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        // go to storage to add word
        console.log(result);
        const imageLink = await this.createImageInStorage(result);
        const audioLink = await this.createAudioInStorage(result);
        const newWord = new WordClass("", result.name, imageLink, this.categoryService.currentCategory.id, 0, audioLink, false, -1, true);
        this.wordService.addPhrase(newWord);
        this.getwords();

      }
    });
  }
}
