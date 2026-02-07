import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentHome } from './pages/student/student-home/student-home.component';
import { InstructorHomeComponent } from './pages/instructor/instructor-home/instructor-home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppShellComponent } from './layouts/app-shell/app-shell.component';
import { StudentExamComponent } from './pages/students_exam/student-exam.component';
import { ExamsListComponent } from './pages/Exams_List/exams-list.component';
import { ExamResultComponent } from './pages/exam-result/exam-result.component';
import { InstructorQuestionsComponent } from './pages/Instructor_questions/Instructor_questions.component';
import { InstructorExamsComponent } from './pages/Instructor_Exams/Instructor_Exams.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'register',
  },

  {
    path: 'app',
    component: AppShellComponent,
    children: [
      {
        path: 'studentHome',
        component: StudentHome,
        title: 'Student Home',
      },
      {
        path: 'instructorHome',
        component: InstructorHomeComponent,
        title: 'Instructor Home',
      },
      { path: '', redirectTo: 'studentHome', pathMatch: 'full' }, // default
      { path: 'exams', component: ExamsListComponent },
      {
        path: 'take-exam/:id',
        component: StudentExamComponent,
        
      },
      { path: 'exam-results', component: ExamResultComponent },
      { path: 'questions', component: InstructorQuestionsComponent },
      { path: 'IExams', component: InstructorExamsComponent }
    ],
  },
];
