import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameResult } from 'src/app/shared/models/game-result.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  isCustonExists=false;

  constructor(public router: Router,public gameService: GameInfraService) {
  }

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

  navigateToGame()
  {
    this.gameService.customGame = false;
    this.router.navigate(['question-page']);
  }

  navigateToCustomGame()
  {
    this.gameService.customGame = true;
    this.router.navigate(['question-page']);
  }
}
