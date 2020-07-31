import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignedInUserComponent } from './signed-in-user/signed-in-user.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';



const routes: Routes = [
  {path: 'signed',component: SignedInUserComponent,canActivate: [AuthGuard]},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignupComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
