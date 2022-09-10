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
import { GameComponent } from './components/game/game.component';
import { QuestionComponent } from './components/question/question.component';
import { ResultPageComponent } from './components/result-page/result-page.component';
import { AnalyticsPageComponent } from './components/analytics-page/analytics-page.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { TestSettingsComponent } from './components/test-settings/test-settings.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { TestQuestionsComponent } from './components/test-questions/test-questions.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'category-page', component: CategoryPageComponent, canActivate: [AuthGuard] },
  { path: 'word-page', component: WordPageComponent, canActivate: [AuthGuard]},
  {path: 'about-me', component: AboutMeComponent, canActivate: [AuthGuard] },
  {path: 'therapist-panel', component: TherapistPanelComponent ,canActivate: [AuthGuard]},
  {path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard] },
  {path: 'patient-therpist-page', component: PatientTherpistPageComponent,canActivate: [AuthGuard] },
  {path: 'game-page', component: GameComponent,canActivate: [AuthGuard] },
  {path: 'question-page', component: QuestionComponent,canActivate: [AuthGuard] },
  {path: 'result-page', component: ResultPageComponent,canActivate: [AuthGuard]},
  {path: 'analytics-page', component:AnalyticsPageComponent,canActivate: [AuthGuard]},
  {path: 'game-settings-page', component:GameSettingsComponent,canActivate: [AuthGuard]},
  {path: 'create-game-page', component:CreateGameComponent,canActivate: [AuthGuard]},
  {path: 'test-settings', component:TestSettingsComponent,canActivate: [AuthGuard]},
  {path:'create-test', component:CreateTestComponent,canActivate: [AuthGuard]},
  {path:'test-questions-page', component:TestQuestionsComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}