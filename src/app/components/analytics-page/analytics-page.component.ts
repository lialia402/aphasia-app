import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnalyticsInfraService } from 'src/app/shared/services/analytics-infra.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { GameInfraService } from 'src/app/shared/services/game-infra.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit {

  constructor(public authService: AuthService, public categoryService:CategoryInfraService, public analytics:AnalyticsInfraService,public gameService: GameInfraService) { }

  ngOnInit(): void {
    
    this.analytics.getSortedWordsListByViewsDesc();
    this.analytics.getSortedCategoriesListByViewsDesc();
    this.analytics.getGameImprovment();

    
    this.analytics.getGameAnswers();
   
    
    let myChart1 = new Chart("myChart1", {
      type: 'bar',
      data: {
          labels: this.analytics.topTenWordsNames,
          datasets: [{
              label: 'כמות צפיות',
              data: this.analytics.topTenWordsViews,
              backgroundColor: [
                  '#1C75E1',
              ],
              borderColor: [
                  '#1C75E1',
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

  let myChart2 = new Chart("myChart2", {
    type: 'pie',
    data: {
        labels: this.analytics.topFiveCategoriesNames,
        datasets: [{
            label: 'כמות צפיות',
            data: this.analytics.topFiveCategoriesViews,
            backgroundColor: [
                '#E4C618',
                '#1AA9D2',
                '#E0160C',
                '#22AC41',
                '#B85FC5',
            ],
            borderColor: [
                '#FDFDFD',
            ],
            borderWidth: 1
        }]
    },
    options: {}
});


let myChart3 = new Chart("myChart3", {
    type: 'bar',
    data: {
        labels: this.analytics.categoriesNamesInGame,
        datasets: [
          {
            label: 'צדק',
            data: this.analytics.rightAnswers,
            backgroundColor: '#22AC41',
            borderColor: '#22AC41',
            borderWidth: 1
          },
          {
            label: 'טעה',
            data:this.analytics.wrongAnswers ,
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderWidth: 1
          },
        ]
      },
      options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

let myChart4 = new Chart("myChart4", {
    type: 'line',
    data: {
        labels: this.analytics.dateArray,
        datasets: [{
          label: 'תוצאות משחק',
          data: this.analytics.gameRightAnswers,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
 } });
  }

  public async getCategories()
  {
    await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
    await this.gameService.getGameResultsByEmail(this.authService.patientOfTherapist.email);
  }
}
