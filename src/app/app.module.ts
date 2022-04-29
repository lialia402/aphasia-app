import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { MatRadioModule } from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

// routing
import { AppRoutingModule } from './app-routing.module';

// service
import { AuthService } from './shared/services/auth.service';
import { CategoryCardComponent } from './components/utils/category-card/category-card.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { WordPageComponent } from './components/word-page/word-page.component';
import { MaterialModule } from './material/material.module';
import { ConfirmationDialogComponent } from './components/utils/confirmation-dialog/confirmation-dialog.component';
import { ReturnButtonComponent } from './components/utils/return-button/return-button.component';
import { AddDialogComponent } from './components/utils/add-dialog/add-dialog.component';
import { FooterComponent } from './components/utils/footer/footer.component';
import { AddCategoryDialogComponent } from './components/utils/add-category-dialog/add-category-dialog.component';
import { SideBarComponent } from './components/utils/side-bar/side-bar.component';
import { AboutMeComponent } from './components/about-me/about-me.component';


@NgModule({
  entryComponents: [SideBarComponent],
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    CategoryCardComponent,
    CategoryPageComponent,
    WordPageComponent,
    ConfirmationDialogComponent,
    ReturnButtonComponent,
    AddDialogComponent,
    FooterComponent,
    AddCategoryDialogComponent,
    SideBarComponent,
    AboutMeComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent,SideBarComponent],
})

export class AppModule {}