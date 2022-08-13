import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  rightWrongType:number = 0;

  rangeChart1 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  rangeChart2 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  rangeChart3 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  chart1: Chart<"bar", number[], string>;
  chart2: Chart<"doughnut", number[], string>;
  chart3: Chart<"bar", number[], string>
  chart4: Chart<"line", number[], string>
 

  constructor(
      public authService: AuthService, 
      public categoryService:CategoryInfraService, 
      public analytics:AnalyticsInfraService,
      public gameService: GameInfraService) { }


  // @ViewChild('buttonAll') button;
  // @ViewChild('button') button;
  // @ViewChild('button') button;

  ngOnInit(): void {
    
    this.analytics.updateData();
    this.analytics.getSortedWordsListByViewsDesc();
    this.analytics.getGameImprovment();
    this.analytics.getGameAnswers(0);
    this.analytics.getCategoriesAnalytics();
   
    // bar graph of the 10 most viewed words by the user
    this.chart1 = new Chart("myChart1", {
      type: 'bar',
      data: {
          labels: this.analytics.topTenWordsNames,
          datasets: [{
              label: 'כמות צפיות',
              data: this.analytics.topTenWordsViews,
              backgroundColor: [
                  '#0F9BD0',
              ],
              borderColor: [
                  '#0F9BD0',
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

// doughnut graph of the 5 most viewed categories by the user for all time
this.chart2 = new Chart("myChart2", {
  type: 'doughnut',
  data: {
      labels: this.analytics.topFiveCategoriesNames,
      datasets: [{
          label: 'כמות צפיות',
          data: this.analytics.topFiveCategoriesViews,
          backgroundColor: [
              '#A984E6',
              '#F16B5C',
              '#81E988',
              '#83DDE7',
              '#0F9BD0',
          ],
          borderColor: [
              '#FFFFFF',
          ],
          borderWidth: 1
      }]
  },
  options: {
      aspectRatio: 1,
      maintainAspectRatio : false,
  }
});

// bar graph of the number of wrong answers against the number of correct answers given by the user from each category
this.chart3 = new Chart("myChart3", {
    type: 'bar',
    data: {
        labels: this.analytics.categoriesNamesInGame,
        datasets: [
          {
            label: 'צדק',
            data: this.analytics.rightAnswers,
            backgroundColor: '#65E278',
            borderColor: '#65E278',
            borderWidth: 1
          },
          {
            label: 'טעה',
            data:this.analytics.wrongAnswers ,
            backgroundColor: '#F16B5C',
            borderColor: '#F16B5C',
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

// line graph of results for up to the last 10 games the user has played
this.chart4 = new Chart("myChart4", {
    type: 'line',
    data: {
        labels: this.analytics.dateArray,
        datasets: [{
          label: 'תוצאות משחק',
          data: this.analytics.gameRightAnswers,
          fill: true,
          borderColor: '#727272',
          tension: 0.1
        }]
 } });
  }

  public async getCategories()
  {
    await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
    await this.gameService.getGameResultsByEmail(this.authService.patientOfTherapist.email);
  }

  filterByDataCategory(){
    if(this.rangeChart2.value.start !== undefined && this.rangeChart2.value.start !== null && this.rangeChart2.value.end !== undefined && this.rangeChart2.value.end !== null){
      this.analytics.getSortedCategoriesListByStartAndEndDate(this.analytics.topFiveCategoriesNames,
        this.analytics.topFiveCategoriesViews,this.rangeChart2.value.start,this.rangeChart2.value.end);
    }

    this.chart2.update();
  }

  filterByDataWords(){
  if(this.rangeChart1.value.start !== undefined && this.rangeChart1.value.start !== null && 
    this.rangeChart1.value.end !== undefined && this.rangeChart1.value.end !== null){
      this.analytics.getSortedWordsListByStartAndEndDate(this.analytics.topTenWordsNames,
        this.analytics.topTenWordsViews,this.rangeChart1.value.start,this.rangeChart1.value.end);
    }
    this.chart1.update();
  }

  resetWords(){
    this.analytics.getSortedWordsListByViewsDesc();
    this.rangeChart1.reset();
    this.chart1.update();
  }


  resetCategory(){
    this.analytics.getSortedCategoriesListByViewsDesc();
    this.rangeChart2.reset();
    this.chart2.update();
  }

  resetWrongRight(){
    this.analytics.getGameAnswers(this.rightWrongType);
    this.rangeChart3.reset();
    this.chart3.update();
  }

  filterByDataWrongRight(){
    if(this.rangeChart3.value.start !== undefined && this.rangeChart3.value.start !== null &&
       this.rangeChart3.value.end !== undefined && this.rangeChart3.value.end !== null)
       {
        this.analytics.filterWrongRightByEndStart(this.rangeChart3.value.start,this.rangeChart3.value.end,this.rightWrongType);
       }

       else{
        this.analytics.getGameAnswers(this.rightWrongType);
       }

    this.chart3.update();
  }

  filterAll(){
    this.analytics.getGameImprovment();
    this.chart4.update();

  }

  filterCustom(){
    this.analytics.filterAllGameByType(1);
    this.chart4.update();
    
  }

  filterRandom(){
    this.analytics.filterAllGameByType(0);
    this.chart4.update();
  }
}
