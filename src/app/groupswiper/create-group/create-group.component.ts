import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {
  autenticazione;
  db;
  message: string;
  groups: string[];

  constructor(private router: Router, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;
  }

  fadeout(to) {
    var x = document.getElementById("background");
    var y = document.getElementById("block");
    x.classList.remove("fade-in");
    x.className += " fade-out";
    y.classList.remove("fade-in");
    y.className += " fade-out-up";
    setTimeout(()=>{this.router.navigateByUrl(to)}, 450);
  }

  async savedata(): Promise<void> {
    const name = (document.getElementById("nome") as HTMLInputElement).value;
    const contacts = (document.getElementById("contacts") as HTMLInputElement).value;
    const locationtime = (document.getElementById("lfo") as HTMLInputElement).value;
    const description = (document.getElementById("descrizione") as HTMLInputElement).value;

    if (!name || !contacts || !locationtime || !description) {
      throw new Error("Qualche campo è vuoto.");
    }
    if (name.length >= 30) {
      throw new Error("Nome troppo lungo. (Max 30 caratteri)");
    } else if (!/^[\s\S]+, \d\d-\d\d$/.test(locationtime)) {
      throw new Error("Il luogo e l'orario devono essere nella forma: luogo, ora-ora.");
    } else if (!/^https:\/\/t\.me\/[^\s,]+,\s@[\w.]+,\shttps:\/\/chat\.whatsapp\.com\/[^\s,]+$/.test(contacts)) {
      throw new Error("I contatti devono essere nella forma: http://t.me/..., @..., http://chat.whatsapp.com/...");
    } 
    const [firstHour, secondHour] = locationtime.split(",")[1].split("-").map(Number);
    if (firstHour < 0 || firstHour >= 24 || secondHour < 0 || secondHour > 24) {
      throw new Error("La fascia oraria non è valida (supera le 23 o va a meno di 00)");
    } 
    const [telegram, instagram, whatsapp] = contacts.split(",").map(String);
    const user: any = await firstValueFrom(this.authService.getUser());
    const information: any = await firstValueFrom(this.firestore.getItem("user", user.uid));
    let returned = await this.db.addItemWOid("group", {
      name: name,
      medium_age: information.age,
      telegram: telegram,
      instagram: instagram.trim(),
      phone: whatsapp.trim(),
      locationAndTime: locationtime,
      description: description,
      members: [user.uid],
      rejected: [],
      requests: {}
    });
    (information.accepted_groups).push(returned.id);
    await this.db.updateItem("user", information.id, {
      accepted_groups: information.accepted_groups
    });
    await this.db.updateItem("group", returned.id, {
      id: returned.id
    });
  }

  async fadeoutsv(to: string) {
    (document.getElementById("create-button") as HTMLButtonElement).disabled = true;
    try {
      await this.savedata();
      this.correct("Gruppo creato correttamente");
      setTimeout( () => {
        const x = document.getElementById("background");
        const y = document.getElementById("block");
        if (x && y) {
          x.classList.remove("fade-in");
          x.classList.add("fade-out");
          y.classList.remove("fade-in");
          y.classList.add("fade-out-up");
          setTimeout(() => {
            this.router.navigateByUrl(to);
            setTimeout(() => {
              window.location.reload();
            }, 100);
            
          }, 450);
        }
      }, 300)
    } catch (error: any) {
      (document.getElementById("create-button") as HTMLButtonElement).disabled = false;
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
}
