import { Component, HostListener, OnInit } from '@angular/core';
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

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.authService.SignOut();
  }

  rightWrongType:number = 0;
  tenGamesType:number = 0;

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

  rangeChart5 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  rangeChart6 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  chart1: Chart<"bar", number[], string>;
  chart2: Chart<"doughnut", number[], string>;
  chart3: Chart<"bar", number[], string>
  chart4: Chart<"line", number[], string>
  chart5: Chart<"line", number[], string>
  chart6: Chart<"line", number[], string>
  gameTypeName3:string = "";
  gameTypeName4:string = "";
 
  constructor(
      public authService: AuthService, 
      public categoryService:CategoryInfraService, 
      public analytics:AnalyticsInfraService,
      public gameService: GameInfraService) { }

  ngOnInit(): void { 
    this.analytics.updateData();
    this.analytics.getSortedWordsListByViewsDesc();
    this.analytics.getGameImprovment();
    this.analytics.getTestDuration();
    this.analytics.getTestImprovemnt();
    this.analytics.getGameAnswers(0);
    this.analytics.getCategoriesAnalytics();
    this.gameTypeName3='כלל המשחקים';
    this.gameTypeName4='כלל המשחקים';

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
          fill: false,
          borderColor: '#65E278',
          tension: 0.1
        }]
 } });


 // line graph of results for up to the last 10 games the user has played
this.chart5 = new Chart("myChart5", {
  type: 'line',
  data: {
      labels: this.analytics.timeSpentName,
      datasets: [{
        label: 'משך המבחן ',
        data: this.analytics.timeSpentArray,
        fill: false,
        borderColor: '#83DDE7',
        tension: 0.1
      }]
} });

// line graph of results for up to the last 10 games the user has played
this.chart6 = new Chart("myChart6", {
  type: 'line',
  data: {
      labels: this.analytics.testGradeNames,
      datasets: [{
        label: 'תוצאות מבחן',
        data: this.analytics.testGradeArray,
        fill: false,
        borderColor: '#A984E6',
        tension: 0.05
      }]
    } });
  }

  public async getCategories()
  {
    await this.categoryService.updateCategoriesArrayByEmail(this.authService.patientOfTherapist.email);
    await this.gameService.getGameResultsByEmail(this.authService.patientOfTherapist.email);
  }

  // get the appropriate data for the desired date range- chart 2
  filterByDataCategory(){
    if(this.rangeChart2.value.start !== undefined && this.rangeChart2.value.start !== null && this.rangeChart2.value.end !== undefined && this.rangeChart2.value.end !== null){
      this.analytics.getSortedCategoriesListByStartAndEndDate(this.analytics.topFiveCategoriesNames,
        this.analytics.topFiveCategoriesViews,this.rangeChart2.value.start,this.rangeChart2.value.end);
    }
    this.chart2.update();
  }

  // get the appropriate data for the desired date range- chart 1
  filterByDataWords(){
  if(this.rangeChart1.value.start !== undefined && this.rangeChart1.value.start !== null && 
    this.rangeChart1.value.end !== undefined && this.rangeChart1.value.end !== null){
      this.analytics.getSortedWordsListByStartAndEndDate(this.analytics.topTenWordsNames,
        this.analytics.topTenWordsViews,this.rangeChart1.value.start,this.rangeChart1.value.end);
    }
    this.chart1.update();
  }

  // return to the default filter for the entire time range- chart 1
  resetWords(){
    this.analytics.getSortedWordsListByViewsDesc();
    this.rangeChart1.reset();
    this.chart1.update();
  }

  // get the appropriate data for the desired date range- chart 5
  filterTestDuration(){
    if(this.rangeChart5.value.start !== undefined && this.rangeChart5.value.start !== null && 
      this.rangeChart5.value.end !== undefined && this.rangeChart5.value.end !== null){
        this.analytics.getSortedTestDurationByStartAndEndDate(this.rangeChart5.value.start,this.rangeChart5.value.end);
      }
    this.chart5.update();
  }

  // return to the default filter for the entire time range- chart 5
  resetTestDuration(){
    this.analytics.getTestDuration();
    this.rangeChart5.reset();
    this.chart5.update();
  }

  // get the appropriate data for the desired date range- chart 6
  filterTestGrade(){
    if(this.rangeChart6.value.start !== undefined && this.rangeChart6.value.start !== null && 
      this.rangeChart6.value.end !== undefined && this.rangeChart6.value.end !== null){
        this.analytics.getSortedTestGradeByStartAndEndDate(this.rangeChart6.value.start,this.rangeChart6.value.end);
      }
    this.chart6.update();
  }

  // return to the default filter for the entire time range- chart 6
  resetTestGrade(){
    this.analytics.getTestImprovemnt();
    this.rangeChart6.reset();
    this.chart6.update();
  }

  // return to the default filter for the entire time range- chart 2
  resetCategory(){
    this.analytics.getSortedCategoriesListByViewsDesc();
    this.rangeChart2.reset();
    this.chart2.update();
  }

  // return to the default filter for the entire time range- chart 3
  resetWrongRight(){
    this.analytics.getGameAnswers(this.rightWrongType);
    this.rangeChart3.reset();
    this.chart3.update();
  }

  // get the appropriate data for the desired date range- chart 3
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

  // get the appropriate data for custom & random games- chart 4
  filterAll(){
    this.analytics.getGameImprovment();
    this.chart4.update();
  }

  // get the appropriate data for custom games- chart 4
  filterCustom(){
    this.analytics.filterAllGameByType(1);
    this.chart4.update();
  }

  // get the appropriate data for random games- chart 4
  filterRandom(){
    this.analytics.filterAllGameByType(0);
    this.chart4.update();
  }
}