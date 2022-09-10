import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userData: any; // Save logged in user data
  user:User | undefined;
  patientOfTherapist:User;
  usersCollection: AngularFirestoreCollection<User> | undefined;
  users: Observable<User[]> = new Observable<User[]>()
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public db: AngularFireDatabase,
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {

    // saving user data in localstorage when logged in and setting up null when logged out 
    this.afAuth.authState.subscribe((user:any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } 
      else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // sign in with email and password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(result.user?.emailVerified === false){
          window.alert('עוד לא אישרת את הרשמתך, כנס לתיבת הדואר האלקטרוני');
        }
        this.ngZone.run(() => {
          this.router.navigate(['home-page']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        if(error.message.includes('password is invalid'))
        {
          window.alert('סיסמא אינה תקינה');
        }
        else if(error.message.includes('email address is badly formatted'))
        {
          window.alert('כתובת האימייל אינה תקינה');
        }
        else if(error.message.includes('There is no user record'))
        {
          window.alert('כתובת האימייל אינה קיימת במערכת');
        }
        else{
          window.alert(error.message);
        }
      });
  }

  firstSignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home-page']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {});
  }
  
  // sign up with require details
  SignUp(firstName: string, lastName: string, userID: string, email: string, password: string, userType: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {

        // call the SendVerificaitonMail() function when new user sign up and returns promise 
        this.SendVerificationMail();
        this.afs.collection('users/').doc(result.user?.uid).set({userType: userType}, {
          merge: true,
        })
        if(userType==='admin'){
          this.afs.collection('users/').doc(result.user?.uid).set({listOfPatients: []}, {
            merge: true,
          })
        }
        this.SetUserData(result.user, firstName, lastName, userID,false);
      }).catch((error) => {
        if(error.message.includes('email address is already in use'))
        {
          window.alert('כתובת האימייל כבר קיימת במערכת');
        }
        //email address is badly formatted
        else if(error.message.includes('email address is badly formatted'))
        {
          window.alert('כתובת האימייל אינה תקינה');
        }
        else{
          window.alert(error.message);
        }
       
      });
  }

  // send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // reset forget password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('מייל עבור איפוס הסיסמא נשלח, אנא בדוק את תיבת הדואר האלקטרוני');
      })
      .catch((error) => {
        if(error.message.includes('email address is badly formatted'))
        {
          window.alert('כתובת האימייל אינה תקינה');
        }
        else if(error.message.includes('There is no user record'))
        {
          window.alert('כתובת האימייל אינה קיימת במערכת');
        }
        else{
          window.alert(error.message);
        }
      });
  }

  // returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // setting up user data when sign in/sign up with social auth provider in Firestore database 
  SetUserData(user: any, firstName?:string, lastName?:string, userID?:string,firstTime?:boolean) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );


    let userData: User;
    if(firstName!== undefined && lastName!== undefined && userID!== undefined)
    {
        userData= {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        firstName:firstName,
        lastName: lastName,
        userID: userID,
        firstTime:firstTime,
      };
    }
    else
    {
        userData= {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      };
    }

    return userRef.set(userData, {
      merge: true,
    });
  }

  // update user data in firebase
  UpdateUserData(user: any, firstName?:string, lastName?:string, userID?:string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    let userData: User;
    userData= {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    firstName:firstName,
    lastName: lastName,
    userID: userID,
    firstTime: true,
    userType: user.userType,
  };
    this.user= userData;
    
    return userRef.set(userData, {
      merge: true,
    });
  }

  // set user data for the first time
  SetFirstTime() {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );
    
    if(this.user !== undefined)
    {
      this.user.firstTime = true;
    }
    let userData: User;
      userData= {
        uid: this.userData.uid,
        email: this.userData.email,
        emailVerified: this.userData.emailVerified,
        firstTime:true,
      };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}