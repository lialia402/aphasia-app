
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

   /**
   * for handling the promise returned, use "promise.then((data) =>{'data' hold the wanted user...})"
   * for catching error use "promise.then().catch(e){...handling error...}"
   * @param email of user.
   * @returns Promise object
   */
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
  let user:User ;
  let promise= this.getUserByID(patientID);
  await promise.then((data) => {
    user = data;
  }).then(()=>{
    let email=user?.email

  })
 
}
}

