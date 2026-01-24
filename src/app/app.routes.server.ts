import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/studentHome',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/instructorHome',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/exams',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/exam-results',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/questions',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'app/IExams',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'app/take-exam/:id',
    renderMode: RenderMode.Client,
  },
];
