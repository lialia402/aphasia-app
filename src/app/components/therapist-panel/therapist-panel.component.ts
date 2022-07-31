import { Component, OnInit } from '@angular/core';
import { AddDialogPatientComponent } from '../utils/add-dialog-patient/add-dialog-patient.component';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
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
  constructor(public userService: UserInfaService, public authService: AuthService, public router: Router ,public dialog: MatDialog, public storageService: StorageInfraProvider,public userInfaService: UserInfaService) 
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
    else
    {
      this.user = this.authService.user;
    }
  }

  // option to therapist delete specific patient
  public deletePatient(user: User) {
    setTimeout(async () => {
      await this.userService.removePatient(user);   
      this.getPatients();  
    }, 500)
  }

  // show to therapist his own patients
  getPatients()
  {
   this.patients= this.userService.importPatients();
  }

  // verify the delete patient request
  async openDialog(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result&&user!==null)
      {
       this.deletePatient(user);
      }
    });
  }

  // option to therapist adding new patient
  async addNewPatient() {
    const dialogRef = this.dialog.open(AddDialogPatientComponent, {
      height: '220px',
      width: '300px',
      data: {patientID: this.patientID}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        //go to storage to add word
        await this.userService.addNewPatientForTherpist(result.id);
        this.getPatients();
      }
    });
  }

  // navigate to specific patient data
  public openSelectedPatient(user:User)
  {
    this.authService.patientOfTherapist = user;
    this.router.navigate(['patient-therpist-page']);
  }
}
