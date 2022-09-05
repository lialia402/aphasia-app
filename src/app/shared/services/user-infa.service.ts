
import { AuthService } from './auth.service';
import { FirebaseInfraService } from './firebase-infra.service';
import { Injectable } from '@angular/core';
import { User } from '../services/user';

@Injectable({
  providedIn: 'root'
})

export class UserInfaService {
  
  users:any[]=[];
  patients:any[]=[];
  constructor(
    public firebaseInfraService: FirebaseInfraService, 
    public authentication: AuthService,) {
      
    this.updateUsersArray()
  }

  // updating the users local array by subscribe the users observable array
  private updateUsersArray() {
    this.firebaseInfraService.importCategories();
    this.firebaseInfraService.getUsersObservable.subscribe(a => {
      this.users = a;
    });
  }

  // get user by unique email and return a promise
  public getUserByEmail(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(this.users.find(e => e.email === email));
    })
  }

  // get user by unique id and return a promise
  public getUserByID(ID: string): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(this.users.find(e => e.userID === ID));
    })
  }

  // add a new patient to therpist
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

  // remove patient from therpist list of patients
  public removePatient(user:User)
  {
    const index = this.authentication.user?.listOfPatients?.indexOf(user.email);
    if(index!==undefined&&index>-1)
    {
      this.authentication.user?.listOfPatients?.splice(index, 1);
    }

    this.firebaseInfraService.removePatient(user.email);
  }

  // return list of patients for the therapist
  public importPatients(){
    try
    {
      let emailPatients=this.authentication.user.listOfPatients || ''; 
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
        console.log(e);
      }
     
    return this.patients;
  }

  public getAllPatients(){
    return this.users.filter((user) => user.userType === 'patient');
  }

  public getAllTherapist(){
    return this.users.filter((user) => user.userType === 'admin');
  }

  public isIDExist(id: string){
    return this.users.some((user) => user.userID === id);
  }
}

