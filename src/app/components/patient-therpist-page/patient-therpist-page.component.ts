import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-patient-therpist-page',
  templateUrl: './patient-therpist-page.component.html',
  styleUrls: ['./patient-therpist-page.component.scss']
})

export class PatientTherpistPageComponent implements OnInit {
    isLoading:boolean;

    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
      this.authService.SignOut();
    }
    
    constructor(
      public authService: AuthService,
      public categoryService: CategoryInfraService, 
      public router: Router,
      public gameService:GameInfraService,
      public testService:EquizInfraService,) { 
        
        this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
        this.categoryService.importSuperCategoriesArray();
        this.gameService.getGameResultsByEmail(this.authService.patientOfTherapist.email);
        this.gameService.getGamesByEmail(this.authService.patientOfTherapist.email);
        this.gameService.getGameSettingsByEmail(this.authService.patientOfTherapist.email);
        this.testService.getTestsByEmail(this.authService.patientOfTherapist.email);
        this.testService.getTestResultByEmail(this.authService.patientOfTherapist.email);
  }

  ngOnInit(): void {
    if(this.categoryService.categories.length === 0)
    {
      this.isLoading = true;
      setTimeout(() => this.isLoading = false, 2000);
    }
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

  navigateToTestSettings()
  {
    this.router.navigate(['test-settings']);
  }
}
