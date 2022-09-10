import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInitService } from 'src/app/shared/services/app-init.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { WordInfraService } from 'src/app/shared/services/word-infra.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public appBuilderProvider: AppInitService | undefined

  constructor(
    public authService: AuthService,
    public categoryInfra: CategoryInfraService,
    public wordInfra: WordInfraService,
    public router: Router) 
    {
      this.appBuilderProvider = new AppInitService(this.categoryInfra, this.wordInfra, this.authService);
    }
  
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.authService.SignOut();
  }
  
  ngOnInit(): void {
   if(this.authService.user !== undefined && !this.authService.user?.firstTime && this.authService.user?.userType !== "admin")
    {
      setTimeout(async () => {
        this.appBuilderProvider?.newFillDB();
        this.authService.SetFirstTime();   
      }, 1500)
    }
  }

  public showCategories(){
   this.router.navigate(['category-page']);
  }
}