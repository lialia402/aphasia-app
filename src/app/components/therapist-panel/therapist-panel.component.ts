import { Component, OnInit } from '@angular/core';
import { AddDialogPatientComponent } from '../utils/add-dialog-patient/add-dialog-patient.component';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';
import { User } from 'src/app/shared/services/user';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';

@Component({
  selector: 'app-therapist-panel',
  templateUrl: './therapist-panel.component.html',
  styleUrls: ['./therapist-panel.component.scss']
})

export class TherapistPanelComponent implements OnInit {

  patientID: any;
  user:any;
  public patients: User[];
  constructor(
    public userService: UserInfaService, 
    public authService: AuthService, 
    public router: Router ,
    public dialog: MatDialog, 
    public storageService: StorageInfraProvider,
    public userInfaService: UserInfaService,
    public errorService: ErrorInfra) 
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{ data: {name: "למחוק"}});
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
        let user = this.findUser(result.id);
        if(user === undefined){
          this.errorService.openSimleSnackBar('לא קיים משתמש זה במערכת', 'סגור');
        }
        else if(user.userType === 'admin'){
          this.errorService.openSimleSnackBar('לא ניתן להוסיף משתמש זה', 'סגור');
        }
        else if(this.findPatient(result.id) !== undefined){
          this.errorService.openSimleSnackBar('המטופל כבר קיים אצלך במערכת', 'סגור');
        }
        else{
        // go to storage to add word
        await this.userService.addNewPatientForTherpist(result.id);
        this.getPatients();
        }
      }
    });
  }

  // find user in user list
  public findUser(id:string){
    const findUser = (obj: any) => obj.userID === id;
    return this.userService.users.find(findUser);
  }

  // find user in patient list
  public findPatient(id:string){
    const findPatient = (obj: any) => obj.userID === id;
    return this.userService.patients.find(findPatient);
  }

  // navigate to specific patient data
  public openSelectedPatient(user:User)
  {
    this.authService.patientOfTherapist = user;
    this.router.navigate(['patient-therpist-page']);
  }

  public exitApp(){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: {name: "להתנתק"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.authService.SignOut();
        this.router.navigate(['sign-in']).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
