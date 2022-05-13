import { Component, OnInit } from '@angular/core';
import { AddDialogPatientComponent } from '../utils/add-dialog-patient/add-dialog-patient.component';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AddCategoryDialogComponent } from '../utils/add-category-dialog/add-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';
import { User } from 'src/app/shared/services/user';


@Component({
  selector: 'app-therapist-panel',
  templateUrl: './therapist-panel.component.html',
  styleUrls: ['./therapist-panel.component.scss']
})
export class TherapistPanelComponent implements OnInit {

  patientID: any;
  user:any;
  public patients: User[];
  constructor(public userService: UserInfaService, public authService: AuthService, private route: ActivatedRoute, public categoryService: CategoryInfraService, public router: Router ,public dialog: MatDialog, public storageService: StorageInfraProvider,public userInfaService: UserInfaService) 
  {
    this.getPatients();
  }
  ngOnInit(): void {
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
  public deletePatient(user: User) {
    setTimeout(async () => {
      await this.userService.removePatient(user);   
      this.getPatients();  
    }, 500)
  }

  getPatients()
  {
   this.patients= this.userService.importPatients();
   console.log(this.userService.importPatients());
  }

  async openDialog(user: User) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result&&user!==null)
      {
       this.deletePatient(user);
     
      }
  
    });
  }

  async addNewPatient() {
    const dialogRef = this.dialog.open(AddDialogPatientComponent, {
      height: '220px',
      width: '300px',
      data: {patientID: this.patientID}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        // go to storage to add word
        console.log(result.id);
        await this.userService.addNewPatientForTherpist(result.id);
        this.getPatients();
      }
    });
  }

}
