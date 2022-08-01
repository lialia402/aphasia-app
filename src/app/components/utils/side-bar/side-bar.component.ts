import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
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

  fillerContent = Array.from({length: 10}, () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  constructor(public authService: AuthService,public userInfaService: UserInfaService,  public router: Router) {
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
  }

  public navigateToGame(){
    this.router.navigate(['game-page']);
  }

  public navigateToCategory(){
    this.router.navigate(['category-page']);
  }

  public handleClick(item:any){

    if(item.displayName === 'התנתקות'){
      this.authService.SignOut();
      window.location.reload();
    }
  }

}

