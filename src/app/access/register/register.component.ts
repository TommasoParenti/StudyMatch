import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { DbService } from '../../_services/db.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: '../login&registration.css'
})
export class RegisterComponent{
  imageurl = "assets/school.png";
  message: string = "Errore inaspettato";
  autenticazione;
  db;

  constructor(private authService: AuthService, private firestore: DbService, private router: Router) {
    this.autenticazione = authService;
    this.db = firestore;
  }

  async signUpWithEmail(): Promise<void> {
    const form = document.getElementById("form").childNodes;
    const email = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;
    const checkbox = (form[2].childNodes[0] as HTMLInputElement).checked;

    if (email && password && checkbox) {
      try {
        await this.autenticazione.signUpWithEmail(email, password);
        this.correct("Inviata l'email di verifica; confermare l'identità.");
        const user = await firstValueFrom(this.authService.getUser());
        await this.saveUid(user);
      } catch (error) {
        this.error(error.message);
      }
    } else {
      this.error("Qualche campo è vuoto.");
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      await this.autenticazione.googleSignUp();
      this.correct("La tua identità è già confermata da google.");
      const user = await firstValueFrom(this.authService.getUser());
      await this.saveUid(user);
    } catch (error) {
      this.error(error.message);
    }
  }

  async signUpWithFacebook(): Promise<void> {
    try {
      await this.autenticazione.facebookSignUp();
      this.correct("Inviata l'email di verifica; confermare l'identità.");
      const user = await firstValueFrom(this.authService.getUser());
      await this.saveUid(user);
    } catch (error) {
      this.error(error.message);
    }
  }

  async signUpWithMicrosoft(): Promise<void> {
    try {
      await this.autenticazione.microsoftSignUp();
      this.correct("Inviata l'email di verifica; confermare l'identità.");
      const user = await firstValueFrom(this.authService.getUser());
      await this.saveUid(user);
    } catch (error) {
      this.error(error.message);
    }
  }

  error(message) {
    const error = document.getElementById("error")
    error.style.display = "flex";
    this.message = message;
    setTimeout(()=>{error.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{error.classList.remove("fade-out-bubble"); error.style.display = "none"}, 2400);
  }

  correct(message) {
    const correct = document.getElementById("correct")
    correct.style.display = "flex";
    this.message = message;
    setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"}, 2400);
  }

  private async saveUid(user: any): Promise<void> {
    await this.db.addItem("user", user.uid, { completed: false });
    await this.router.navigateByUrl("access/register/complete-profile");
  }
}
