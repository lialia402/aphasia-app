import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss']
})
export class ResultPageComponent implements OnInit {

  constructor(public gameService: GameInfraService, public router: Router) { }

  ngOnInit(): void {
    if(this.gameService.finalScoreCurrentGame>=7)
    {
      this.playVoice();
    }
  }

  navigateToAnotherGame()
  {
    this.router.navigate(['game-page']);
  }

  navigateToDashboard()
  {
    this.router.navigate(['dashboard']);
  }

  public returnCorrectText()
  {
    let correctAnswers=this.gameService.finalScoreCurrentGame;
    if(correctAnswers===10)
    {
      return "מעולה! צדקת ב- 10/10 מילים"
    }
    else if(correctAnswers===9 || correctAnswers===8)
    {
      return ` ${correctAnswers}/כל הכבוד! צדקת ב10`;
    }
    else
    {
      return ` ${correctAnswers}/פעם הבאה תצליח יותר! צדקת ב10`;
    }
  }

  public playVoice() {
    let voice= new Audio();
    voice.src= "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Audience_Clapping_-_Sound_Effect%5BConConverter.com%5D.mp3?alt=media&token=93c4fd5e-1260-4a06-a74a-605b38e99143";
    voice.load();
    voice.play();
  }

}
