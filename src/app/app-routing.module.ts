import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { WordPageComponent } from './components/word-page/word-page.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { TherapistPanelComponent } from './components/therapist-panel/therapist-panel.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PatientTherpistPageComponent } from './components/patient-therpist-page/patient-therpist-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'category-page', component: CategoryPageComponent },
  { path: 'word-page', component: WordPageComponent},
  {path: 'about-me', component: AboutMeComponent },
  {path: 'therapist-panel', component: TherapistPanelComponent },
  {path: 'home-page', component: HomePageComponent },
  {path: 'patient-therpist-page', component: PatientTherpistPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}