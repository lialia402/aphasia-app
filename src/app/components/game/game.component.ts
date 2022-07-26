import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(public router: Router,public gameService: GameInfraService) {}

  ngOnInit(): void {
    setTimeout(async () => {
      await this.gameService.giveRandomList();
   }, 500)
  }

  navigateToGame()
  {
    this.router.navigate(['question-page']);
  }
}
