import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnalyticsInfraService } from 'src/app/shared/services/analytics-infra.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit {

  constructor(public authService: AuthService, public categoryService:CategoryInfraService, public analytics:AnalyticsInfraService) { }

  ngOnInit(): void {
    
    this.analytics.getSortedListByViewsDesc()
    
    
    let myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.analytics.topTenWordsNames,
          datasets: [{
              label: '# of Votes',
              data: this.analytics.topTenWordsViews,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

  public async getCategories()
  {
    await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
  }
}
