import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TestInfo } from 'src/app/shared/models/test-info.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.scss']
})
export class TestSettingsComponent implements OnInit {

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.authService.SignOut();
  }

  currentTest:TestInfo;
  disableTests:TestInfo[];
  message1 = "";
  message2 = "";

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public testService:EquizInfraService,
    public messageInfra: ErrorInfra,
    private _snackBar: MatSnackBar,
    public categoryService:CategoryInfraService) 
    { }

  ngOnInit(): void {
    setTimeout(async () => {
      this.updateTest()      
    }, 500)
  }

  // get list of all the tests
  getTests()
  {
    this.currentTest=this.testService.getActiveTest();
    this.disableTests=this.testService.getDisactiveTest().sort((a,b) => (this.wasPlayed(a) < this.wasPlayed(b)) ? 1 : ((this.wasPlayed(a) > this.wasPlayed(b)) ? -1 : 0));
  }

  // get an update list of all the test
  updateTest()
  {
    let promise=this.testService.getTestsByEmail(this.authService.patientOfTherapist.email);
    promise.then((data) => {
      this.testService.tests = data;
      this.getTests();
    })
  }

  navigateToCreateTest()
  {
    if(this.categoryService.getAllUserPhrases.length < 10)
    {
      this.messageInfra.openSimleSnackBar('כעת מספר המילים במערכת קטן מעשר ולכן לא ניתן ליצור משחק', 'סגור');
    } 
    else if(this.testService.validWords() === true){
      this.messageInfra.openSimleSnackBar('כעת מספר המילים המשוייכות לקטגוריות בהן יש יותר מ4 מילים קטן מ10', 'סגור');
    }
    else if(this.currentTest===undefined)
    {
      this.router.navigate(['create-test']);
    }
    else
    {
      this.messageInfra.openSimleSnackBar('לא ניתן להוסיף את המבחן, כבר קיים מבחן מופעל במערכת ', 'סגור');
    }
  }

  // return if the test cannot be restarted
  canBeEnabled(test: string[]){
    let flag = true;
    let allWords = this.categoryService.getAllUserPhrases;
    for(let i=0;i<test.length && flag;i++){
      if(allWords.some((word)=> { return word.name === test[i]}) === false)
      {
        flag = false;
      }
      else{
        let wordTemp = allWords.find((word)=> {return word.name === test[i]});
        let tempArray = allWords.filter(word => word.categoryID === wordTemp.categoryID);
        if(tempArray.length < 4){
          flag = false;
        }
      }
    }

    this.getMessage(test);
    return flag;
  }

  // get a message why the test cannot be restarted
  getMessage(test: string[]){
    this.message1 = "";
    this.message2 = "";
    let words = "";
    let categories = "";
    let allWords = this.categoryService.getAllUserPhrases;
    for(let i=0;i<test.length ;i++){
      if(allWords.some((word)=> { return word.name === test[i]}) === false)
      {
        words += `${test[i]},`;
      }
      else{
        let wordTemp = allWords.find((word)=> {return word.name === test[i]});
        let tempArray = allWords.filter(word => word.categoryID === wordTemp.categoryID);
        if(tempArray.length < 4){
          categories += `${test[i]},`;
        }
      }
    }

    if(words.length>0){
      words = words.substring(0, words.length - 1);
      this.message1 += `המילים הבאות אינן קיימות יותר במערכת: ${words}`;
    }

    if(categories.length>0){
      categories = categories.substring(0, categories.length - 1);
      this.message2 += `בקטגוריות אליהן המילים הבאות משוייכות אין מספיק מילים: ${categories}`;
    }

  }

  // delete the test
  deleteTestInfo(test:TestInfo)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: "למחוק"}});
     dialogRef.afterClosed().subscribe(result => {
       if(result)
      {
        setTimeout(async () => {
          this.testService.deleteTestInfo(test);
          this.updateTest()      
        }, 500)
      }
    });
  }

  // disactive the test
  disActivateTestInfo(test:TestInfo)
  {
    setTimeout(async () => {
      this.testService.updateDisActivateTest(test);
      this.updateTest()      
    }, 500)
    this._snackBar.open('המבחן כובה בהצלחה', 'סגור');
  }

  // activate the test
  activateTestInfo(test:TestInfo)
  {
    if(this.currentTest===undefined)
    {
      setTimeout(async () => {
        this.testService.updateActivateTest(test);
        this.updateTest()      
      }, 500)
      this._snackBar.open('המבחן הופעל מחדש', 'סגור');
    }
    else
    {
      this.messageInfra.openSimleSnackBar('לא ניתן להוסיף את המבחן, כבר קיים מבחן מופעל במערכת ', 'סגור');
    }
  }

  // return if the test was played
  wasPlayed(test: TestInfo){
    return this.testService.testResult.filter(a => a.testId === test.id).length > 0;
  }

  // return if the patient answer the word incorrectly
  isWrong(test: TestInfo, word:string){
    if(this.wasPlayed(test) === false)
    {
      return false;
    }

    let testResult = this.testService.testResult.find(a => a.testId === test.id);
    return testResult?.wrongList.some(a=> a === word);
  }

  // return if the patient answer the word correctly
  isRight(test: TestInfo, word:string){
    if(this.wasPlayed(test) === false)
    {
      return false;
    }

    let testResult = this.testService.testResult.find(a => a.testId === test.id);
    return testResult?.rightList.some(a=> a === word);
  }

  // get the duration it took the patient to complete the specific test 
  getTestDuration(testId: string){
    let minutes = "";
    this.testService.testResult.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());
    let testResult = this.testService.testResult.find((test) => test.testId === testId);

    if(testResult !== undefined)
    {
      minutes = testResult.duration.toPrecision(2);
    }
    return minutes;
  }

  // get the grade of the specific test
  getTestGrade(testId: string){
    let grade = 0;
    this.testService.testResult.sort((b, a) => new Date(b.answerDate).getTime() - new Date(a.answerDate).getTime());
    let testResult = this.testService.testResult.find((test) => test.testId === testId);
    if(testResult !== undefined)
    {
      grade = testResult.rightList.length;
    }
    return grade;
  }

  // return the given date object in the appropriate format
  toDate(date: Date){ 
    let dateNew = new Date(date).toLocaleDateString();
    return dateNew;
  }
}
