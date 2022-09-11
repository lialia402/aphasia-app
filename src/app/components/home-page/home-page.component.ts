
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  user:any;
  isLoading:boolean=true;
  constructor(
    public authService: AuthService,
    public userInfaService: UserInfaService,
    public router: Router) {}

  ngOnInit(): void{
    if(this.authService.user === undefined)
    {
      setTimeout(async () => {
      let email= this.authService.userData.email;
      let promise= this.userInfaService.getUserByEmail(email);
       promise.then((data) => {
        this.user = data;
        this.authService.user = this.user;
        this.isLoading = false;
      });     
    }, 3000)
    }
    else{
      this.isLoading = false;
      this.user = this.authService.user;
    }
  }

  // navigate to the right page according to the type of user: patient vs therapist
  public NavigateUser(){
    if(this.authService.user.userType === "admin")
    {
      this.router.navigate(['therapist-panel']);
    }
    else if(this.authService.user.userType === "patient")
    {
      this.router.navigate(['dashboard']);
    }
    else if(this.authService.user.userType === "superAdmin")
    {
      this.router.navigate(['category-page']);
    }
  }
}