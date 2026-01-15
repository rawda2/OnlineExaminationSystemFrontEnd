import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentHomeComponent } from './pages/student/student-home/student-home.component';
import { InstructorHomeComponent } from './pages/instructor/instructor-home/instructor-home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppShellComponent } from './layouts/app-shell/app-shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'register'
  },


  {
    path: 'app',
    component:AppShellComponent,
    children: [
      { path: 'studentHome', component: StudentHomeComponent, title: 'Student Home' },
      { path: 'instructorHome', component: InstructorHomeComponent, title: 'Instructor Home' },
      { path: '', redirectTo: 'studentHome', pathMatch: 'full' }, // default
    ],
  },

];
