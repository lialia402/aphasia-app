import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { Game } from 'src/app/shared/models/game.model';
import { WordClass } from 'src/app/shared/models/word-class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
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
  imageLoaded = false;

  constructor(
    public gameService: GameInfraService,
    public router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
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
    this.cardAnswers= this.gameService.getOptionsPerRound(this.currentRound*4);
  }

  public getQuestionWord() {
    this.cardQuestion= this.gameService.getCardQuestionPerRound(this.currentRound);
  }

  // check if the chosen word is the correct answer and it matches the picture of the question
  public validateAnswer(answer:WordClass) {
    if(answer.name===this.cardQuestion.name)
    {
      this.right=true;
      this.correctAnswers++;
      setTimeout(() => {
      this.gameService.increaseRightAnswer(this.cardQuestion.categoryID);
        this.nextRound(answer);
        this.imageLoaded = false;
      }, 1000);
    }
    else{
      this.wrong=true;
      setTimeout(() => {
        this.gameService.increaseWrongAnswer(this.cardQuestion.categoryID);
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
      this.gameService.finalScoreCurrentGame=this.correctAnswers;
      const currentGame = new Game("",this.correctAnswers, this.authService.user.email,new Date());
      this.gameService.addGame(currentGame);
      if(this.gameService.customGame)
      {
        this.gameService.updateGameInfo(this.gameService.finalScoreCurrentGame);
      }
      this.router.navigate(['result-page']);
    }
  }

  navigateHomePage(){
    this.gameService.currentCustomGame = -1;
    this.gameService.customGame = false;
    this.router.navigate(['dashboard']);
  }

  showQuestionAndAnswer(){
    this.imageLoaded = true;
  }
}
