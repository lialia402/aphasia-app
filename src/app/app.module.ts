import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
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
import { TherapistPanelComponent } from './components/therapist-panel/therapist-panel.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddDialogPatientComponent } from './components/utils/add-dialog-patient/add-dialog-patient.component';
import { PatientTherpistPageComponent } from './components/patient-therpist-page/patient-therpist-page.component';
import { GameComponent } from './components/game/game.component';
import { QuestionComponent } from './components/question/question.component';
import { ResultPageComponent } from './components/result-page/result-page.component';
import { EditCategoryDialogComponent } from './components/utils/edit-category-dialog/edit-category-dialog.component';
import { EditWordsDialogComponent } from './components/utils/edit-words-dialog/edit-words-dialog.component';
import { AnalyticsPageComponent } from './components/analytics-page/analytics-page.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { NgModule } from '@angular/core';
import { TestSettingsComponent } from './components/test-settings/test-settings.component';
import { CreateTestComponent } from './components/create-test/create-test.component';



@NgModule({
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
        TherapistPanelComponent,
        HomePageComponent,
        AddDialogPatientComponent,
        PatientTherpistPageComponent,
        GameComponent,
        QuestionComponent,
        ResultPageComponent,
        EditCategoryDialogComponent,
        EditWordsDialogComponent,
        AnalyticsPageComponent,
        GameSettingsComponent,
        CreateGameComponent,
        TestSettingsComponent,
        CreateTestComponent,
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
    bootstrap: [AppComponent, SideBarComponent]
})

export class AppModule {}