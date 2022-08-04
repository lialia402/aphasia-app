import { Component, OnInit } from '@angular/core';
import { AppInitService } from 'src/app/shared/services/app-init.service';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  userType: string = "";
  public appBuilderProvider: AppInitService | undefined;

  constructor(
    public authService: AuthService,
    public errorService: ErrorInfra) {}
  ngOnInit() { }

  public signUp(userFirstName:string, userLastName:string, userID:string, userEmail:string, userPwd:string, userType:string){
   if(userFirstName==="" || userLastName === "" || userID==="" || userEmail === "" || userPwd === "" || userType === ""){
    this.errorService.openSimleSnackBar('אנא הזן פרטים חסרים', 'סגור');
   }
   else if(userID.length !== 9){
    this.errorService.openSimleSnackBar('מספר תעודת זהות לא חוקי', 'סגור');
   }
   else{
     this.authService.SignUp(userFirstName,userLastName,userID,userEmail,userPwd,userType);
   }
  }
}