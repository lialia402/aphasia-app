import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.scss']
})
export class TestSettingsComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,) 
    { }

  ngOnInit(): void {
  }

  navigateToCreateTest()
  {
    this.router.navigate(['create-test']);
  }

}
