import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import {Location} from '@angular/common';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { GameSettings } from 'src/app/shared/models/game-settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { GameInfo } from 'src/app/shared/models/game-info.model';
import { Game } from 'src/app/shared/models/game.model';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  checked:any[] = [];
  selectedWords:string[] = [];
  showButton:boolean = false;
  allWords:WordClass[] = [];
  isEditMode=false;

  constructor(
    public authService: AuthService,
    public categoryService: CategoryInfraService,
    public messageInfra: ErrorInfra,
    private _location: Location,
    public gameService:GameInfraService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.allWords = [];
    this.allWords = this.categoryService.getAllUserPhrases;
    this.isEditMode = this.gameService.gameToEdit.gameNum !== -1;
    if(this.isEditMode){
      for(let i=0;i<this.gameService.gameToEdit.listOfWords.length;i++)
      {
        this.checked.push ({
          'checked' : true,
          'value':  this.gameService.gameToEdit.listOfWords[i],
       })
      }
    }
  }

  // sort the words in alphabetical order
  sortedWordsList() : Array<WordClass>{
    this.allWords.sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return this.allWords;
  }

  // allows you to mark exactly 10 words
  getCheckbox(checkbox:any){
    this.checked = [];
    const checked = this.checkBox.filter(checkbox => checkbox.checked);
    if(checked.length === 10){
      this.showButton = true;
    }
    else{
      this.showButton = false;
    }
    checked.forEach((data:any) => {
         this.checked.push ({
            'checked' : data.checked,
            'value':  data.value
         })
    })

    if(this.checked.length > 10)
    {
      this.messageInfra.openSimleSnackBar('שים לב: בחרת יותר מ10 מילים!', 'סגור');
    }
  }

  // create or edit GameSettings object include list of 10 words 
  createGameList(){
    this.selectedWords = [];
    for(let i=0;i<10;i++)
    {
        this.selectedWords.push(this.checked[i].value);
    }

    if((this.gameService.gameSettings[0]=== undefined) || (!this.compareAll(this.selectedWords)))
    {
      if(this.isEditMode){
        let newGameInfo = new GameInfo(this.gameService.gameToEdit.gameNum,this.selectedWords,new Date());
        this.gameService.editGameInfo(newGameInfo);
        this.gameService.gameToEdit = new GameInfo(-1,[],new Date());
        this._snackBar.open('העריכה הושלמה בהצלחה', 'סגור');
      }
  
      else{
        this.insertGameInfo(this.selectedWords);
        this._snackBar.open('ההוספה הושלמה בהצלחה', 'סגור');
      }
      
      
      this._location.back();
    }

    else{
      this.messageInfra.openSimleSnackBar('שים לב: משחק זה קיים עבור המטופל במערכת אנא שנה רשימה מילים', 'סגור');
    }
    
  }

  // compare to all games
  compareAll(newWords:string[])
  {
    let flag = false;
    for(let i=0;i<this.gameService.gameSettings[0].listOfGames.length;i++){
      if(this.compare(this.gameService.gameSettings[0].listOfGames[i].listOfWords,newWords)){
        return true;
      }
    }
    return flag;
  }

  // comare between two games
  compare(array1:string[], array2:string[]){
    array1.sort();
    array2.sort();
    for (var i = 0; i < array1.length; i++){
      if (array1[i] !== array2[i]) return false;
    }
    return true;  
  }

  // Insert new game info 
  insertGameInfo(words:string[]){
    if(this.gameService.gameSettings.length === 0)
    {
      let newInfroArray: GameInfo[] = [];
      let newGameInfo = new GameInfo(0,words, new Date());
      newInfroArray.push(newGameInfo);
      let newGameSetting = new GameSettings("",this.authService.patientOfTherapist.email,true,newInfroArray);
      this.gameService.addGameSettings(newGameSetting);
    }

    else
    {
      let numOfGame =  this.gameService.gameSettings[0].listOfGames.length;
      let newGameInfo = new GameInfo(numOfGame,words, new Date());
      this.gameService.addGameInfo(newGameInfo);
    }

  }

  // filter words per category
  filterPerCategory(categoryID: string){
    let wordsArray = this.categoryService.getAllUserPhrases.filter((word) => {return word.categoryID === categoryID}).sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return wordsArray;
  }

  // count checked per category
  countChecked(categoryID: string){
    let count = 0;
    let wordsArray = this.filterPerCategory(categoryID);
    for(let i=0; i<wordsArray.length;i++){
      if(this.checked.some( obj=> obj.value === wordsArray[i].name)){
        count++;
      }
    }

    return count;
  }

  // when you are in edit mode check if word needs to be checked
  isAlreadyChecked(wordName: string){
    let isWordInCheckedList = false;
    if(this.isEditMode)
    {
      isWordInCheckedList = this.gameService.gameToEdit.listOfWords.some( word => word === wordName);
    }

    return isWordInCheckedList;
  }

  cancel(){
    this._location.back();
    this.gameService.gameToEdit = new GameInfo(-1,[], new Date());
  }
}
