import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes
      ,withInMemoryScrolling({
      scrollPositionRestoration:"top",}),
      withHashLocation(),
      withViewTransitions()
     ),
     provideAnimations(),
     provideHttpClient(withInterceptors([headersInterceptor])),
     provideClientHydration(withEventReplay())

    ]
};
