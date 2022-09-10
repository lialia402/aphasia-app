import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { EquizInfraService } from 'src/app/shared/services/equiz-infra.service';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';

export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements  OnInit {

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  user:any;
  isLoading:boolean = false;


  menu: NavItem [] = [
        {
          displayName: 'פרופיל',
          iconName: 'group',
          route: '/about-me',
        },        
        {
          displayName: 'קטגוריות',
          iconName: 'view_module',
          route: '/category-page',
        },
        {
          displayName: 'על קצה הלשון',
          iconName: 'casino',          
          route: '/game-page',
        },
        {
          displayName: 'התנתקות',
          iconName: 'exit_to_app',          
          route: '/sign-in',
        },
      ];

  constructor(
    public authService: AuthService,
    public userInfaService: UserInfaService,  
    public router: Router,
    public testInfra:EquizInfraService,
    public categoryInfra:CategoryInfraService)
  {

    if(this.authService.user?.firstTime && this.authService.user.userType !== "admin")
    {
      this.isLoading = true;
      setTimeout(async () => {    
        await this.categoryInfra.updateCategoriesArray();
        await this.categoryInfra.updateCategoriesArray();
        await this.categoryInfra.updateCategoriesArray();
        this.testInfra.validateTest();
        this.isLoading = false;
      }, 1500)
    }
  }

  ngOnInit(): void{
    if(this.authService.user === undefined)
    {
      setTimeout(async () => {
      let email= this.authService.userData.email;
      let promise= this.userInfaService.getUserByEmail(email);
      await promise.then((data) => {
        this.user = data;
        this.authService.user = this.user;
      });     
    }, 1500)
    }
    else{
      this.user = this.authService.user;
    }

    if(!this.authService.user?.firstTime && this.authService.user?.userType !== "admin")
    {
        this.isLoading = true;
        setTimeout(() => this.isLoading = false, 25000);
    }
  }

  public navigateToGame(){
    this.router.navigate(['game-page']);
  }

  public navigateToCategory(){
    this.router.navigate(['category-page']);
  }

  public navigateToTest(){
    this.router.navigate(['test-questions-page']);
  }

  public handleClick(item:any){
    if(item.displayName === 'התנתקות'){
      this.authService.SignOut();
      window.location.reload();
    }
  }
}