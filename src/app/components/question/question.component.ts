import { Component, OnInit } from '@angular/core';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  currentRound:number=0;
  public cardQuestion:WordClass;
  public cardAnswers:WordClass[];
  constructor(public gameService: GameInfraService) { }

  ngOnInit(): void {
    this.creatAnswersList();
    this.getQuestionWord();
  }

  public playVoice(word: WordClass) {
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
      //this.gameService.resultPerRround(True)
      console.log('worked');
    }
    else{
      console.log('worked but wrong');
    }
  }

  public nextRound(answer:WordClass) {
    if (this.currentRound<9)
      {
        this.currentRound++;
      }
    else
    {
      //navigate+analytic
    }
  }
}
