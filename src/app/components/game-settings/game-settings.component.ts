import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import {Location} from '@angular/common';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { GameSettings } from 'src/app/shared/models/game-settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(public authService: AuthService,public categoryService: CategoryInfraService,private _location: Location,public gameService:GameInfraService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.allWords = this.categoryService.getAllUserPhrases;
  }

  sortedWordsList() : Array<WordClass>{
    this.allWords.sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return this.allWords;
  }

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
  }

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

  cancel(){
    this._location.back();
  }

}
