import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../_services/authentication.service';
import { Location } from '@angular/common';
import { DbService } from '../../../_services/db.service';
import { StorageService } from '../../../_services/storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-complete-profile-1',
  templateUrl: './complete-profile-1.component.html',
  styleUrl: '../complete-profile.css'
})
export class CompleteProfile1Component implements OnInit{
  db;
  autenticazione;
  storage;
  message: string;
  downloadURL;
  file;
  cities: string[] = [];

  constructor(private router: Router, private location:Location, private authService: AuthService, private firestore: DbService, private storageService: StorageService) {
    this.autenticazione = authService;    
    this.db = firestore;
    this.storage = storageService;   
  }
  
  async ngOnInit() {
    const navigationState = history.state;
    if (navigationState.redirect != null) {
      this.error("Devi prima completare il profilo.")
    }
    await this.preparecities(); 
  }

  loadFile(event) {
    const background = document.getElementById('background');
    var output = document.getElementById('output') as HTMLImageElement;
    output.style.display="inherit";
    background.classList.add("background-opened");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }
    this.file = event.target.files[0];
  }

  async onFileSelected(file: File): Promise<void> {
    try {
      this.downloadURL = await this.storageService.uploadProfileImage(file);
    } catch (error) {
      error.message = "Immagine non caricata correttamente."
      throw error;
    }
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

  async fadeoutsv(to: string) {
    (document.getElementById("confirm-button") as HTMLButtonElement).disabled = true;
    try {
      await this.savedata();
      const x = document.getElementById("background");
      const y = document.getElementById("block");
      if (x && y) {
        x.classList.remove("fade-in");
        x.classList.add("fade-out");
        y.classList.remove("fade-in");
        y.classList.add("fade-out-up");
        setTimeout(() => {
          this.router.navigateByUrl(to);
        }, 450);
      }
    } catch (error: any) {
      (document.getElementById("confirm-button") as HTMLButtonElement).disabled = false;
      this.error(error.message);
    }
  }

  async savedata(): Promise<void> {
    const name = (document.getElementById("nome") as HTMLInputElement).value;
    const surname = (document.getElementById("cognome") as HTMLInputElement).value;
    const age = (document.getElementById("eta") as HTMLInputElement).value;
    const locationtime = (document.getElementById("lfo") as HTMLInputElement).value;
    const description = (document.getElementById("descrizione") as HTMLInputElement).value;
    const city = (document.getElementById("citta") as HTMLInputElement).value;
    const faculty = (document.getElementById("facolta") as HTMLInputElement).value;
    if (!name || !surname || !age || !locationtime || !description || !faculty || !city) {
      throw new Error("Qualche campo è vuoto.");
    }
    if (name.length >= 20) {
      throw new Error("Nome troppo lungo. (Max 20 caratteri)");
    } else if (surname.length >= 20) {
      throw new Error("Cognome troppo lungo. (Max 20 caratteri)");
    } else if (isNaN(Number(age))) {
      throw new Error("L'età non è un intero.");
    }
    const ageNumber = Number(age);
    if (ageNumber < 18 || ageNumber > 99) {
      throw new Error("Sei fuori l'età consentita.");
    } else if (!/^[\s\S]+, \d\d-\d\d$/.test(locationtime)) {
      throw new Error("Il luogo e l'orario devono essere nella forma: luogo, ora-ora.");
    }
    const [firstHour, secondHour] = locationtime.split(",")[1].split("-").map(Number);
    if (firstHour < 0 || firstHour >= 24 || secondHour < 0 || secondHour > 24) {
      throw new Error("La fascia oraria non è valida (supera le 23 o va a meno di 00)");
    } else if(this.file == undefined) {
      throw new Error("Devi caricare un'immagine profilo.");
    }
    await this.onFileSelected(this.file);
    const user: any = await firstValueFrom(this.authService.getUser());
    await this.db.updateItem("user", user.uid, {
      id: user.uid,
      name: name,
      surname: surname,
      age: ageNumber,
      locationAndTime: locationtime,
      description: description,
      city: city,
      faculty: faculty,
      accepted: [],
      rejected: [],
      requests: {},
      matched: {},
      accepted_groups: [],
      rejected_groups: []
    });
  }

  error(message) {
    const error = document.getElementById("error-cmplt-1")
    error.style.display = "flex";
    this.message = message;
    setTimeout(()=>{error.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{error.classList.remove("fade-out-bubble"); error.style.display = "none"}, 2400);
  }

  async preparecities() {
    const url = "https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        for(let item of data) {
          this.cities.push(item.nome.toLowerCase());
        }
    } catch (error) {
        throw error;
    }
  }
}
