import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';
import {Location} from '@angular/common';
import { TestInfo } from 'src/app/shared/models/test-info.model';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {

  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  @ViewChildren ('checkBoxCustom') checkBoxCustom:QueryList<any>;
  checked:any[] = [];
  checkedCustom:any[] = [];
  selectedWords:string[] = [];
  showButton:boolean = false;
  allWords:WordClass[] = [];
  nameOfTest:string;
  
  constructor(
    public testService:EquizInfraService,
    public authService: AuthService,
    public categoryService: CategoryInfraService,
    public messageInfra: ErrorInfra,
    private _location: Location,
    public gameService:GameInfraService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  sortedWordsList() : Array<WordClass>{
    this.allWords.sort(function(a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });
    return this.allWords;
  }

  // allows you to mark exactly 10 words
  getCheckbox(checkbox:any){
    let checkDuplicate=this.checked;
    this.checked = [];
    const checked = this.checkBox.filter(checkbox => checkbox.checked);
    if(checked.length+ this.checkedCustom.length === 10){
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
    
    if(this.checked.length + this.checkedCustom.length > 10)
    {
      this.messageInfra.openSimleSnackBar('שים לב: בחרת יותר מ10 מילים!', 'סגור');
    }
  }

  getCheckboxCustom(checkBoxCustom:any)
  {
    this.checkedCustom = [];
    const checked = this.checkBoxCustom.filter(checkbox => checkbox.checked);
    if(checked.length+this.checked.length === 10){
      this.showButton = true;
    }
    else{
      this.showButton = false;
    }
    checked.forEach((data:any) => {
         this.checkDuplicate(data.value);
         this.checkedCustom.push ({
            'checked' : data.checked,
            'value':  data.value
         })
    })
    if(this.checked.length+ this.checkedCustom.length > 10)
    {
      this.messageInfra.openSimleSnackBar('שים לב: בחרת יותר מ10 מילים!', 'סגור');
    }
  }

  countCustomChecked(gameNum: number)
  {
    let count = 0;
    let wordsArray = this.gameService.gameSettings[0].listOfGames[gameNum].listOfWords;
    for(let i=0; i<wordsArray.length;i++){
      if(this.checkedCustom.some( obj=> obj.value === wordsArray[i])){
        count++;
      }
    }
  
    return count;
  }

// create or edit GameSettings object include list of 10 words 
  createTestList(){
    this.selectedWords = [];
    let tempArray=this.checked.concat(this.checkedCustom);
    for(let i=0;i<10;i++)
    {
        this.selectedWords.push(tempArray[i].value);
    }
    if(this.nameOfTest===undefined || this.nameOfTest==="")
    {
      this.messageInfra.openSimleSnackBar('לא ניתן להוסיף את המבחן, יש למלא שם ', 'סגור');
    }
    else if(this.hasDuplicates(this.selectedWords))
    {
      this.messageInfra.openSimleSnackBar('לא ניתן להוסיף את המבחן, יש מילים שמופיעות מספר פעמים  ', 'סגור');
    }   
    else
    {
      this.insertTestInfo(this.selectedWords, this.nameOfTest);
      this._snackBar.open('ההוספה הושלמה בהצלחה', 'סגור');
      this._location.back();  
    }
  }

  hasDuplicates(array:string[]) 
  {
    return (new Set(array)).size !== array.length;
  }

  checkDuplicate(word:string)
  {
    if(this.checked.some( obj=> obj.value === word)||this.checkedCustom.some( obj=> obj.value === word))
    {
      this._snackBar.open('שים לב, המילה שסימנת נבחרה מספר פעמים', 'סגור');

    }
  }

  insertTestInfo(listOfWords:string[], nameOfTest:string)
  {
    let newTestInfo = new TestInfo("", this.authService.patientOfTherapist.email, listOfWords, nameOfTest);
    this.testService.addTestInfo(newTestInfo);
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
    //this.gameService.gameToEdit = new GameInfo(-1,[], new Date());
  }
}
