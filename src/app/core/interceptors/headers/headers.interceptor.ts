import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID,inject } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId =inject(PLATFORM_ID);
  if(isPlatformBrowser(platformId)){
  
  if (req.url.includes('Auth/login') || req.url.includes('Auth/register')) {
    return next(req);
  }
    const token=localStorage.getItem('user_token');

    if(token){
      req=req.clone({
        setHeaders:{
          Authorization: `Bearer ${token}`
        }
      })
    }
  }

  return next(req);
};
