import { Component, OnInit } from '@angular/core';
import { AppInitService } from 'src/app/shared/services/app-init.service';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  userType: string = "";
  public appBuilderProvider: AppInitService | undefined;

  constructor(public authService: AuthService) {}
  ngOnInit() { }
}