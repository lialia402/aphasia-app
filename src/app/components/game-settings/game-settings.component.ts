import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import {Location} from '@angular/common';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { GameSettings } from 'src/app/shared/models/game-settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})

export class GameSettingsComponent implements OnInit {
  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  checked:any[] = [];
  selectedWords:string[] = [];
  showButton:boolean = false;
  allWords:WordClass[] = [];

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

  // create GameSettings object include list of 10 words 
  createGameList(){
    for(let i=0;i<10;i++)
    {
        this.selectedWords.push(this.checked[i].value);
    }

    let newGameSetting = new GameSettings("",this.authService.patientOfTherapist.email,this.selectedWords);
    this.gameService.addGameSettings(newGameSetting);
    this._snackBar.open('ההוספה הושלמה בהצלחה', 'סגור');
    this._location.back();
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

  cancel(){
    this._location.back();
  }
}
