import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfo } from 'src/app/shared/models/game-info.model';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  isCustonExists=false;
  isRandomGameEnabled = false;
  CustomGames:GameInfo[] = [];
  isLoading:boolean=true;

  constructor(
    public router: Router,
    public gameService: GameInfraService) {}

  ngOnInit(): void {
    this.gameService.currentCustomGame = -1;
    this.gameService.customGame = false;
    setTimeout(async () => {
      await this.gameService.checkAndGiveRandomList();
      await this.gameService.getGameResults();
      await this.gameService.getGames();
      let settings = await this.gameService.getGameSettings();

      if(settings.length === 1){
        this.isRandomGameEnabled = settings[0].enableRandomGame;
        if(settings[0].listOfGames.length > 0)
        {
          this.CustomGames = settings[0].listOfGames;
          this.isCustonExists = true;
        }
      }
      else{
        this.isRandomGameEnabled = true;
      }

      if(this.gameService.randomWordList.length === 0){
        this.isRandomGameEnabled = false;
      }
      this.isLoading = false;

   }, 500)
  }

  // navigate to diffult game
  navigateToGame()
  {
    
    this.gameService.customGame = false;
    this.router.navigate(['question-page']);
  }

  // navigate to game created by the therapist
  navigateToCustomGame(game:GameInfo)
  {
    this.gameService.customGame = true;
    this.gameService.currentCustomGame = game.gameNum;
    this.gameService.giveCustomList(game.listOfWords);
    this.router.navigate(['question-page']);
  }
}
