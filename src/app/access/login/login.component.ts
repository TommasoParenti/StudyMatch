import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { LoggedService } from '../../_services/logged.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: '../login&registration.css'
})
export class LoginComponent implements OnInit{
  imageurl = "assets/school.png";
  message: string = "Errore inaspettato";
  autenticazione;

  constructor(private authService: AuthService, private router: Router, private login: LoggedService) {
    this.autenticazione = authService;
  }

  ngOnInit(): void {
    const navigationState = history.state;
    if(!window.navigator.onLine) {
      this.router.navigate(["/offline"]);
    }
    if (navigationState.complete != null) {
      this.correct("Adesso puoi accedere.");
    }
  }

  async loginWithEmail(): Promise<void> {
    const form = document.getElementById("form").childNodes;
    const email = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    if (email && password) {
      try {
        await this.autenticazione.signInWithEmail(email, password);
        await this.router.navigateByUrl("userswiper");
      } catch (error) {
        if (error.message !== "Prima devi completare il profilo.") {
          this.error(error.message);
        } else {
          this.errorcmpt();
        }
      }
    } else {
      this.error("Qualche campo è vuoto.");
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.autenticazione.googleSignIn();
      await this.router.navigateByUrl("userswiper");
    } catch (error) {
      if (error.message !== "Prima devi completare il profilo.") {
        this.error(error.message);
      } else {
        this.errorcmpt();
      }
    }
  }

  async loginWithFacebook(): Promise<void> {
    try {
      await this.autenticazione.facebookSignIn();
      await this.router.navigateByUrl("userswiper");
    } catch (error) {
      if (error.message !== "Prima devi completare il profilo.") {
        this.error(error.message);
      } else {
        this.errorcmpt();
      }
    }
  }

  async loginWithGitHub(): Promise<void> {
    try {
      await this.autenticazione.githubSignIn();
      await this.router.navigateByUrl("userswiper");
    } catch (error) {
      if (error.message !== "Prima devi completare il profilo.") {
        this.error(error.message);
      } else {
        this.errorcmpt();
      }
    }
  }

  correct(message) {
    const correct = document.getElementById("correct")
    correct.style.display = "flex";
    this.message = message;
    setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"}, 2400);
  }

  error(message) {
    localStorage.removeItem("age");
    localStorage.removeItem("location");
    localStorage.removeItem("time");
    const error = document.getElementById("error");
    if(error!=null) {
      error.style.display = "flex";
      this.message = message;
      setTimeout(()=>{error.classList.add("fade-out-bubble");}, 2000);
      setTimeout(()=>{error.classList.remove("fade-out-bubble"); error.style.display = "none"}, 2400);
    }
  }

  errorcmpt() {
    this.router.navigate(
      ["access/register/complete-profile"],
      { state: { redirect: window.location.pathname } }
    );
  }

  async resetPassword() {
    try {
      const form = document.getElementById("form").childNodes;
      const email = (form[0] as HTMLInputElement).value;
      await this.autenticazione.reset(email);
      const correct = document.getElementById("correct-reset")
      correct.style.display = "flex";
      setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2000);
      setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"}, 2400);
    } catch (error) {
      this.error(error.message);
    }
  }
}
