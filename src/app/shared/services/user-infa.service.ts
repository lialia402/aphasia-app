import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserInfaService {

  users:any[]=[];
  currentUser:any;

  
  constructor(public firebaseInfraService: FirebaseInfraService, public authentication: AuthService,) {
        
    this.updateUsersArray()
    this.currentUser = this.parseGetUserByEmail();
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

  public parseGetUserByEmail()
  {
    let email= this.authentication.userData.email;
    let promise= this.getUserByEmail(email);
    promise.then((data:any) => {
      this.currentUser = data;
    })
  }



}
