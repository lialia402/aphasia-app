
import { AuthService } from './auth.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs-compat';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfaService {

  users:any[]=[];
  patients:any[]=[];
  
  constructor(public firebaseInfraService: FirebaseInfraService, public authentication: AuthService,) {
        
    this.updateUsersArray()
  
  }

  //updating the users local array by subscribe the users observable array.
  private updateUsersArray() {
    this.firebaseInfraService.importCategories();
    this.firebaseInfraService.getUsersObservable.subscribe(a => {
      this.users = a;
    });
  }

  public getUserByEmail(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(this.users.find(e => e.email === email));
    })
  }

  public getUserByID(ID: string): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(this.users.find(e => e.userID === ID));
    })
  }

  public async addNewPatientForTherpist(patientID:string)
{
  let email;
  let user:User ;
  let promise= this.getUserByID(patientID);
  await promise.then((data) => {
    user = data;
  }).then(()=>{
   email=user?.email;
  this.authentication.user.listOfPatients?.push(email);
   this.firebaseInfraService.addPatient(email);


  })
 
  }

  public removePatient(user:User)
  {
    const index = this.authentication.user?.listOfPatients?.indexOf(user.email);
    if(index!==undefined&&index>-1)
    {
      this.authentication.user?.listOfPatients?.splice(index, 1);
      console.log(index);
    }

  this.firebaseInfraService.removePatient(user.email);
  }

  public importPatients(){
  try{
    let emailPatients=this.authentication.user.listOfPatients || ''; 
    console.log(emailPatients);
    let patientsArrayLength=emailPatients?.length ?emailPatients.length :0;
    if(emailPatients!==undefined)
    {  
      this.patients=[];
    for(let i=0;i<patientsArrayLength;i++)
    {
      this.patients[i]= (this.users.find(e => e.email === emailPatients[i]));      
    }
    }
    }
    catch(e){
      // this.error.simpleToast("Connection error");
     }
     return this.patients;
  }
}

