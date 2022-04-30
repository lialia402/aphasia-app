import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor( public authService: AuthService) { }

  ngOnInit(): void {
  }


  signIn(userName:string,userPassword:string)
  {
    setTimeout(async () => {
      await this.authService.SignIn(userName,userPassword)  
    }, 1500)
  }

}
