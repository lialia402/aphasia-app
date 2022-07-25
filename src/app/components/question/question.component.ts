import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  
  //play the sound of the answer word
  public playVoice(word: WordClass, event:any) {
    event.preventDefault();
    event.stopPropagation()
    let voice= new Audio();
    voice.src= word.audio;
    voice.load();
    voice.play();
  }

  //create four options for answer 
  public creatAnswersList() {
    this.cardAnswers= this.gameService.getOptionsPerRound(this.currentRound*4);
  }

  public getQuestionWord() {
    this.cardQuestion= this.gameService.getCardQuestionPerRound(this.currentRound);
  }

  //check if the chosen word is the correct answer and it matches the picture of the question
  public validateAnswer(answer:WordClass) {
    if(answer.name===this.cardQuestion.name)
    {
      this.right=true;
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

  //check if the game ended. if yes move to result page, and if not show the next question
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
