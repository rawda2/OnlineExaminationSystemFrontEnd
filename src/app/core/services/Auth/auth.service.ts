import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, WritableSignal, signal, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../../shared/interfaces/Auth/ILoginRequest';
import { ILoginResponse } from '../../../shared/interfaces/Auth/ILoginRespone';
import { environment } from '../../environment/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);


  userData: WritableSignal<any> = signal(null);


  currentUser: WritableSignal<ILoginResponse | null> = signal(null);

  isLoggedIn = computed(() => !!this.currentUser());

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.restoreUserData();
  }

  login(data: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${environment.baseURL}Auth/login`,
      data
    );
  }

  handleLoginSuccess(res: ILoginResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // store token + user object
    localStorage.setItem('user_token', res.token);
    localStorage.setItem('current_user', JSON.stringify(res));

    this.currentUser.set(res);

    // decode token (optional)
    this.userData.set(jwtDecode(res.token));
    console.log(this.userData());
  }

  restoreUserData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('user_token');
    const user = localStorage.getItem('current_user');

    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.userData.set(jwtDecode(token));
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('current_user');
    }
    this.currentUser.set(null);
    this.userData.set(null);
    this.router.navigate(['/login']);
  }

  // convenience getters
  roleName(): string | null {
    return this.currentUser()?.roleName ?? null;
  }

  redirectAfterLogin(): void {
  const role = this.roleName();

  if (role === 'Student') this.router.navigate(['/app/studentHome']);
  else if (role === 'Instructor') this.router.navigate(['/app/instructorHome']);
}

}
