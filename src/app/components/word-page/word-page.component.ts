import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { WordInfraService } from 'src/app/shared/services/word-infra.service';
import { AddDialogComponent } from '../utils/add-dialog/add-dialog.component';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { EditWordsDialogComponent } from '../utils/edit-words-dialog/edit-words-dialog.component';

@Component({
  selector: 'app-word-page',
  templateUrl: './word-page.component.html',
  styleUrls: ['./word-page.component.scss']
})
export class WordPageComponent implements OnInit {
  public words: WordClass[];
  public categories: CategoryClass[];
  public category: CategoryClass;
  public name:string;
  public imagePath:any;
  public audioPath:any;
  public imageLink:any;
  isTherapist: boolean;
  isSuperAdmin: boolean;
  isWordDisabled: boolean = false;
  isWordEnabled: boolean = false;

  constructor(
    public authService: AuthService, 
    public categoryService: CategoryInfraService, 
    public wordService: WordInfraService, 
    public router: Router ,
    public dialog: MatDialog, 
    public storageService: StorageInfraProvider, 
    public errorService: ErrorInfra,
    private _snackBar: MatSnackBar,
    public testService: EquizInfraService,
    public gameService: GameInfraService) 
    {
      this.category=categoryService.getCurrentCategory;
    }

  ngOnInit() {
    this.getwords();
    this.getCategories(); 
    this.isTherapist = this.authService.user.userType === 'admin';
    this.isSuperAdmin = this.authService.user.userType === 'superAdmin';
  }

  getCategories(){
    this.categories = this.authService.user.userType === 'superAdmin' ? this.categoryService.superAdminCategories : this.categoryService.categories;
  }

  updateWordsList(category: CategoryClass){
    this.categoryService.currentCategory = category;
    this.wordService.currentCategory = category;
    this.category = category;
    if(this.authService.user.userType === 'patient')
    {
      this.categoryService.increaseViews(category);
      this.categoryService.updateViewsPerDate(category);
    }
    this.getwords();
  }

  getwords()
  {
    let promise;
    if(this.authService.user.userType === 'superAdmin'){
      promise= this.wordService.getSuperAdminPhrases(this.category);
    }
    else
    {
      promise= this.wordService.getPhrases(this.category);
    }
    promise.then((data) => {
      this.words = data;
      //this.wordService.words = data;
      this.checkWordsVisability();
    })
  }
  
  public playVoice(word: WordClass) {
    let voice= new Audio();
    voice.src= word.audio;
    voice.load();
    voice.play();

    if(this.authService.user.userType === 'patient')
    {
    this.wordService.increaseViews(word);
    this.wordService.updateViewsPerDate(word);
    }
  }

   public deleteWord(word: WordClass) {
    setTimeout(async () => {

      if(this.authService.user.userType === 'superAdmin')
      {
        this.wordService.removePhraseSuperAdmin(word);
      }
      else
      {
        this.wordService.removePhrase(word);
      }
      this.getwords();      
    }, 500)
    this.wordService.arrangePhrasesByOrder();
    
  }

  getDeleteMessage(needToDisableActiveTest:boolean, needToDeleteActiveGame: boolean)
  {
    if(needToDisableActiveTest && needToDeleteActiveGame)
    {
      return "למחוק, מחיקה זו תהפוך את המבחן הפעיל כעת ללא פעיל ותמחק משחקים הכוללים מילה זו";
    }
    else if(needToDisableActiveTest){
      return "למחוק, שים לב מחיקה זו תהפוך את המבחן הפעיל כעת ללא פעיל";
    }
    else if(needToDeleteActiveGame)
    {
      return "למחוק, שים לב מחיקה זו תמחק את כל המשחקים הכוללים את המילה הזו";
    }
    else{
      return "למחוק";
    }
  }

  openDialog(word: WordClass) {
    let needToDisableActiveTest = this.isSuperAdmin ? false : this.checkActiveTest(word);
    let needToDeleteActiveGame = this.isSuperAdmin ? false : this.checkGames(word);

    let message = this.getDeleteMessage(needToDisableActiveTest, needToDeleteActiveGame);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: message}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        if(needToDisableActiveTest)
        {
          this.testService.updateDisActivateTest(this.testService.getActiveTest());
        }
        if(needToDeleteActiveGame)
        {
          this.gameService.deleteGamesRealtedToWord(word);
        }
        this.deleteWord(word);
        this._snackBar.open('המחיקה הושלמה בהצלחה', 'סגור');
      }
    });
  }

  checkGames(word: WordClass)
  {

    let allGames = this.gameService.getAllGames();
    let wordsArray = this.categoryService.getAllUserPhrases.filter(a => a.categoryID === word.categoryID).map(a => a.name);
    let flag = false;

    if(wordsArray.length <= 4)
    {
      return true;
    }

    for(let i=0;i<allGames.length && flag === false;i++){
      flag = allGames[i].listOfWords.some((a) => a === word.name);
    }

    return flag;
  }

   // check if the active test containes the category we want to delete
   checkActiveTest(word: WordClass)
   {
     if(this.testService.getActiveTest() === undefined){
       return false;
     }

     else if(this.testService.getActiveTest().wordList.includes(word.name))
     {
      return true;
     }
 
     else{
       let wordsArray = this.categoryService.getAllUserPhrases.filter(word => word.categoryID === this.categoryService.currentCategory.id).map(word => word.name);
      if(this.testService.getActiveTest().wordList.some(r=> wordsArray.includes(r)))
      {
        return wordsArray.length-1 < 4;
      }
      else{
        return false;
      }
     }
   }

  // option to change one or more details: word name, image or sound
  async editWord(word: WordClass)
  {
    const dialogRef = this.dialog.open(EditWordsDialogComponent, {
      height: '560px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath, audioPath: this.audioPath}
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        let newName;
        let newImageLink;
        let newSoundLink;
        // go to storage to edit category
        if((result.imagePath!==undefined || result.name!==undefined || result.audioPath!==undefined))
        {
          newName= result.name===undefined? word.name:result.name;
          newImageLink=word.imageURL;
          if(result.imagePath!==undefined)
          {
            newImageLink= await this.createImageInStorage(result);
          }
          newSoundLink=word.audio;
          if(result.audioPath!==undefined)
          {
            newSoundLink= await this.createAudioInStorage(result);
          }

          let viewsCount=word.views;
          const newWord = new WordClass("", newName, newImageLink, this.categoryService.currentCategory.id, viewsCount, newSoundLink, false, -1, true);

         setTimeout(async () => {
          await this.wordService.removePhrase(word);
          await this.wordService.addPhrase(newWord);
          await this.getwords();
          this._snackBar.open('העריכה הושלמה בהצלחה', 'סגור');
        }, 500);

          if(result.name!==undefined && result.audioPath===undefined)
          {
            this.errorService.openSimleSnackBar('שים לב: שינית את שם המילה אך לא ערכת סאונד', 'סגור');
          }
        }
        else{
          this.errorService.openSimleSnackBar('לא בוצעו שינויים', 'סגור');
        }
      }
    });
  }

  // upload image to storage
  async createImageInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.imagePath,"image");
    return link;
  }

  // upload sound to storage
  async createAudioInStorage(result:any)
  {
    let link = await this.storageService.uploadFile(result.audioPath,"audio");
    return link;
  }

  // option to add new word in specific category
  async addNewWord() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      height: '560px',
      width: '350px',
      data: {name: this.name, imagePath: this.imagePath, audioPath: this.audioPath}
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
        else if(result.audioPath === undefined)
        {
          this.errorService.openSimleSnackBar('לא נבחר סאונד', 'סגור');
        }
        else{
        // go to storage to add word
        const imageLink = await this.createImageInStorage(result);
        const audioLink = await this.createAudioInStorage(result);
        const newWord = new WordClass("", result.name, imageLink, this.categoryService.currentCategory.id, 0, audioLink, false, -1, true);
        this.wordService.addPhrase(newWord);
        this.getwords();
        this._snackBar.open('ההוספה הושלמה בהצלחה', 'סגור');
        }
      }
    });
  }

  // check if there are visible and invisible words
  checkWordsVisability(){
    const checkEnabledWord = (obj: WordClass) => obj.visibility === true;
      this.isWordEnabled = this.wordService.words.some(checkEnabledWord);
      const checkDisabledWord = (obj: WordClass) => obj.visibility === false;
      this.isWordDisabled = this.wordService.words.some(checkDisabledWord);
  }

  // update visibility of a word
  updateVisibility(word:WordClass){
    this.wordService.changeVisibility(word);
    this.checkWordsVisability();
  }
}
