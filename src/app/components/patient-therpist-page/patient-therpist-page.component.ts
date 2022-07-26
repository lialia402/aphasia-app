import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';


@Component({
  selector: 'app-patient-therpist-page',
  templateUrl: './patient-therpist-page.component.html',
  styleUrls: ['./patient-therpist-page.component.scss']
})

export class PatientTherpistPageComponent implements OnInit {
    constructor(public authService: AuthService,public categoryService: CategoryInfraService, public router: Router) { 
    this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
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
}
