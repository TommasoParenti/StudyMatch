import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/authentication.service';
import { LoggedService } from '../_services/logged.service';
import { Observable } from 'rxjs';import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class registerGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private logged: LoggedService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.logged.isRegistered()) { 
      return true;
    } else {
      this.router.navigate(['access/register']);
      return false;
    }
  }
}