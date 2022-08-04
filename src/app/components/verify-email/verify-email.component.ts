import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})

export class VerifyEmailComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  ngOnInit() {
  }

  public navigateToSignUp(){
    this.router.navigate(['sign-in']).then(() => {
      window.location.reload();
    });
  }
}