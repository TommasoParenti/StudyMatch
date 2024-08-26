import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedService {

  login() {
    localStorage.setItem('logged', "true");
  }

  logout() {
    localStorage.setItem('logged', "false");
  }

  isAuthenticated(): boolean {
    return (localStorage.getItem('logged') != null && localStorage.getItem('logged') == "true");
  }

  register() {
    localStorage.setItem('registered', "true");
  }

  registerout() {
    localStorage.setItem('registered', "false");
  }

  isRegistered(): boolean {
    return (localStorage.getItem('registered') != null && localStorage.getItem('registered') == "true");
  }
}
