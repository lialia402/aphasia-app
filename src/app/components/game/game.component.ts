import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  isCustonExists=false;

  constructor(
    public router: Router,
    public gameService: GameInfraService) {}

  ngOnInit(): void {
    setTimeout(async () => {
      await this.gameService.giveRandomList()
      await this.gameService.getGameResults();
      await this.gameService.getGames();
      let settings = await this.gameService.getGameSettings();

      if(settings.length === 1){
        this.isCustonExists = true;
        await this.gameService.giveCustomList();
      }

   }, 500)
  }

  // navigate to diffult game
  navigateToGame()
  {
    this.gameService.customGame = false;
    this.router.navigate(['question-page']);
  }

  // navigate to game created by the therapist
  navigateToCustomGame()
  {
    this.gameService.customGame = true;
    this.router.navigate(['question-page']);
  }
}
