import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { UserInfaService } from 'src/app/shared/services/user-infa.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})

export class AboutMeComponent implements OnInit {
  user: any;
  isEditEnable: boolean=false;
  firstName:string="";
  lastName:string="";
  id:string="";

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.authService.SignOut();
  }

  constructor(
    public authService: AuthService,
    public router: Router,
    public userInfaService: UserInfaService,
    public errorService:ErrorInfra,
    public userService: UserInfaService) {}

   ngOnInit(): void{
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

  // start edit mode in order to change user information
   public startEditOption(){
      this.isEditEnable=true;
   }

  // check if any detail change if not move to cancel
  public saveChangesOption(){
    if(this.firstName==="" && this.lastName==="" && this.id==="")
    {
    this.errorService.openSimleSnackBar('לא הוזנו שינויים', 'סגור');
    this.cancelOption();
    }
    else if(this.id !== "" && this.id.match(/^[0-9]+$/) === null){
      this.errorService.openSimleSnackBar('תעודת זהות לא חוקית ', 'סגור');
    }
    else if(this.id !== "" && this.id.length < 9){
        this.errorService.openSimleSnackBar('תעודת זהות קצרה מידי ', 'סגור');
    }
    else if(this.id !== "" && this.userService.isIDExist(this.id)){
        this.errorService.openSimleSnackBar('תעודת זהות כבר קיימת במערכת', 'סגור');
    }
    else{
    this.firstName=this.firstName===""?this.user.firstName:this.firstName;
    this.lastName=this.lastName===""?this.user.lastName:this.lastName;
    this.id=this.id===""?this.user.userID:this.id;
    this.authService.UpdateUserData(this.user, this.firstName,this.lastName,this.id);
    this.user = this.authService.user;
    this.isEditEnable=false;
    }
  }

  public cancelOption(){
    this.isEditEnable=false;
  }
}
