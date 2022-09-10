import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TestResult } from 'src/app/shared/models/test-result.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';

@Component({
  selector: 'app-test-questions',
  templateUrl: './test-questions.component.html',
  styleUrls: ['./test-questions.component.scss']
})
export class TestQuestionsComponent implements OnInit {

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.authService.SignOut();
  }

  wrong:boolean;
  right:boolean;
  wrongList:string[] = [];
  rightList:string[] = [];
  activeIndex: number;
  currentRound:number=0;
  correctAnswers:number=0;
  public cardQuestion:WordClass;
  public cardAnswers:WordClass[];
  imageLoaded = false;
  startDate:Date;
  endDate:Date;
  
  constructor(
    public testInfra:EquizInfraService,
    public router: Router,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.startDate = new Date();
    this.testInfra.giveTestList();
    this.creatAnswersList();
    this.getQuestionWord();

  }

  // play the sound of the answer word
  public playVoice(word: WordClass, event:any) {
    event.preventDefault();
    event.stopPropagation()
    let voice= new Audio();
    voice.src= word.audio;
    voice.load();
    voice.play();
  }

  // create four options for answer 
  public creatAnswersList() {
    this.cardAnswers= this.testInfra.getOptionsPerRound(this.currentRound*4);
  }

  // get the question word per round
  public getQuestionWord() {
    this.cardQuestion= this.testInfra.getCardQuestionPerRound(this.currentRound);
  }

  // check if the chosen word is the correct answer and it matches the picture of the question
  public validateAnswer(answer:WordClass) {
    if(answer.name===this.cardQuestion.name)
    {
      this.right=true;
      this.correctAnswers++;
      setTimeout(() => {
        this.rightList.push(this.cardQuestion.name)
        this.nextRound(answer);
        this.imageLoaded = false;
      }, 1000);
    }
    else{
      this.wrong=true;
      setTimeout(() => {
        this.wrongList.push(this.cardQuestion.name)
        this.nextRound(answer);
        this.imageLoaded = false;
      }, 2000);
    }
  }

  // check if the game ended. if yes move to result page, and if not show the next question
  public nextRound(answer:WordClass) {
    this.wrong=false;
    this.right=false;
    if (this.currentRound<9)
      {
        this.currentRound++;
        this.creatAnswersList();
        this.getQuestionWord();
      }
    else
    {
      this.endDate = new Date();
      let currentActiveTest = this.testInfra.getActiveTest();
      let myEmail = "";
      if(this.authService.user !== undefined)
      {
        myEmail = this.authService.user.email;
      }
      let duration = (this.endDate.getTime() - this.startDate.getTime())/60000;
      let testResult = new TestResult("",myEmail,currentActiveTest.id,duration,this.wrongList,this.rightList);
      this.testInfra.addTestResult(testResult);
      this.testInfra.updateDisActivateTest(currentActiveTest);
      this._snackBar.open('המבחן הושלם בהצלחה!', 'סגור');
      this.router.navigate(['dashboard']);
    }
  }

  showQuestionAndAnswer(){
    this.imageLoaded = true;
  }
}
