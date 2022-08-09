import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfo } from 'src/app/shared/models/game-info.model';
import { GameSettings } from 'src/app/shared/models/game-settings.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';


@Component({
  selector: 'app-patient-therpist-page',
  templateUrl: './patient-therpist-page.component.html',
  styleUrls: ['./patient-therpist-page.component.scss']
})

export class PatientTherpistPageComponent implements OnInit {
    constructor(
      public authService: AuthService,
      public categoryService: CategoryInfraService, 
      public router: Router,
      public gameService:GameInfraService) { 
        this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
        this.gameService.getGameResultsByEmail(this.authService.patientOfTherapist.email);
        this.gameService.getGamesByEmail(this.authService.patientOfTherapist.email);
        this.gameService.getGameSettingsByEmail(this.authService.patientOfTherapist.email);
  }

  ngOnInit(): void {
  }

  navigateToPatientCategories()
  {
    this.router.navigate(['category-page']);
  }

  navigateToPatientAnalytics()
  {
    this.router.navigate(['analytics-page']);
  }

  navigateToGameSettings()
  {
    this.router.navigate(['game-settings-page']);
  }
}
