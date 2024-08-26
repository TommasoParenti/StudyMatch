import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/authentication.service';
import { LoggedService } from '../_services/logged.service';

@Injectable({
  providedIn: 'root'
})
export class authGuardlogin implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private logged: LoggedService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.logged.isAuthenticated()) { 
      return true;
    } else {
      this.router.navigate(['access/login']);
      return false;
    }
  }
}
