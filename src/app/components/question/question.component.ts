import { Component, OnInit } from '@angular/core';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(public gameService: GameInfraService) { }

  ngOnInit(): void {
  }

}
