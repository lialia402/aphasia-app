import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  user: any;
  constructor(public authService: AuthService,public router: Router,public userInfaService: UserInfaService,) {
        }

  ngOnInit(): void {
   this.getUser();
  }

  async getUser() {
    let email= this.authService.userData.email;
    this.user= await this.userInfaService.getUserByEmail(email);
    console.log(email);
    console.log(this.userInfaService.users);
    console.log(this.user);

  }

}
