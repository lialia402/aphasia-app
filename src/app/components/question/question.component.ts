import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { time } from 'console';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  wrong:boolean;
  right:boolean;
  activeIndex: number;
  currentRound:number=0;
  correctAnswers:number=0;
  public cardQuestion:WordClass;
  public cardAnswers:WordClass[];
  constructor(public gameService: GameInfraService,public router: Router) { }

  ngOnInit(): void {
    this.creatAnswersList();
    this.getQuestionWord();
  }

  public playVoice(word: WordClass, event:any) {
    event.preventDefault();
    event.stopPropagation()
    let voice= new Audio();
    voice.src= word.audio;
    voice.load();
    voice.play();
  }

  public creatAnswersList() {
    this.cardAnswers= this.gameService.getOptionsPerRound(this.currentRound*4);
  }

  public getQuestionWord() {
    this.cardQuestion= this.gameService.getCardQuestionPerRound(this.currentRound);
  }

  public validateAnswer(answer:WordClass) {
    if(answer.name===this.cardQuestion.name)
    {
      this.right=true;
      //this.gameService.resultPerRround(True)
      this.correctAnswers++;
      setTimeout(() => {
        this.nextRound(answer);
      }, 1000);
    }
    else{
      this.wrong=true;
      setTimeout(() => {
        this.nextRound(answer);
      }, 2000);
    }
  }

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
      this.gameService.finalScoreCurrentGame=this.correctAnswers;
      this.router.navigate(['result-page']);
    }
  }
}
