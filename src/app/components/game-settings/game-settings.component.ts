import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameInfo } from 'src/app/shared/models/game-info.model';
import { GameSettings } from 'src/app/shared/models/game-settings.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})

export class GameSettingsComponent implements OnInit {
  gameSetting: GameSettings;
  gamesInformation: GameInfo[];

  constructor(
    public authService: AuthService,
    public categoryService: CategoryInfraService,
    public gameService:GameInfraService,
    public router: Router,
    public dialog: MatDialog,
    public messageInfra: ErrorInfra) { }

  ngOnInit(): void {
    this.gameSetting = this.gameService.gameSettings[0];

    if(this.gameSetting !== undefined){
      this.gamesInformation = this.gameSetting.listOfGames;
      if(this.gamesInformation.length === 0){
        this.messageInfra.openSimleSnackBar('שים לב: כעת אין משחקים מותאמים אישית למטופל', 'סגור');
      }
    }
    else{
      this.messageInfra.openSimleSnackBar('שים לב: כעת אין משחקים מותאמים אישית למטופל', 'סגור');
    }
   
  }

  // delete the specific game
  deleteGameInfo(game:GameInfo){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: "למחוק"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.gameService.deleteGameInfo(game);
        this.gameSetting = this.gameService.gameSettings[0];
        this.gamesInformation = this.gameSetting.listOfGames;
      }
    });

  }

  // count all the words displayed to the user
  countValidWords(){
    let count = 0;
    for(let i=0; i<this.categoryService.categories.length;i++)
    {
      let wordsArray = this.filterPerCategory(this.categoryService.categories[i].id);
      if(wordsArray.length > 3)
      {
        count += wordsArray.length;
      }
    }
    return count < 10;
  }

  // filter words per category
  filterPerCategory(categoryID: string){
    let wordsArray = this.categoryService.getAllUserPhrases.filter((word) => {return word.categoryID === categoryID}).sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return wordsArray;
  }

  navigateToCreateGame(){
    if(this.gamesInformation !== undefined && this.gamesInformation.length === 3)
    {
      this.messageInfra.openSimleSnackBar('כעת יש במערכת 3 משחקים מותאמים אישית למטופל עלייך למחוק אחד כדי לייצר אחד חדש', 'סגור');
    }
    else if(this.categoryService.getAllUserPhrases.length < 10)
    {
      this.messageInfra.openSimleSnackBar('כעת מספר המילים במערכת קטן מעשר ולכן לא ניתן ליצור משחק', 'סגור');
    }
    else if(this.countValidWords() === true){
      this.messageInfra.openSimleSnackBar('כעת מספר המילים המשוייכות לקטגוריות בהן יש יותר מ4 מילים קטן מ10', 'סגור');
    }
    else{
      this.router.navigate(['create-game-page']);
    }
  }

  changeRandomGameSetting(){
    if(this.gameSetting === undefined){
      let newInfroArray: GameInfo[] = [];
      let newGameSetting = new GameSettings("",this.authService.patientOfTherapist.email,false,newInfroArray);
      this.gameService.addGameSettings(newGameSetting);
    }
    else{
      this.gameService.changeRandomGame(this.gameSetting);
    }
  }

  // navigate to edit game page
  editGameInfo(game: GameInfo){
    this.gameService.gameToEdit = game;
    this.router.navigate(['create-game-page']);
  }

  // return the average score in the game
  calculateAverage(game:GameInfo){
    if(game.numOfPlayed === 0){
      return 0;
    }
    else{
      return game.totalScore/game.numOfPlayed;
    }
  }

  // check if the random game bottun enable
  checkEnableRandomGame(){
    if(this.gameSetting === undefined)
    {
      return true;
    }
    else
    {
      return this.gameSetting.enableRandomGame;
    }
  }

  // return the given date object in the appropriate format
  toDate(date: Date){ 
    let dateNew = new Date(date).toLocaleDateString();
    return dateNew;
  }
}
