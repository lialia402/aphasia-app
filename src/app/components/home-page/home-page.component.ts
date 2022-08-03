
import { Component, OnInit} from '@angular/core';
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
  }
}