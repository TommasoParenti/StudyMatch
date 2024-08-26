import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../_services/authentication.service';
import { DbService } from '../../../_services/db.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-complete-profile-2',
  templateUrl: './complete-profile-2.component.html',
  styleUrl: '../complete-profile.css'
})
export class CompleteProfile2Component{
  db;
  autenticazione;
  message: string;
  @ViewChild('video', { static: false }) video: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  photo: string | null = null;
  stream: MediaStream | null = null;
  impossibletoverify: boolean = false;

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

  fadeoutsv() {
    const y = document.getElementById("block");
    const x = document.getElementById("photo-block");
    const telegram = (document.getElementById("Telegram") as HTMLInputElement).value;
    const instagram = (document.getElementById("Instagram") as HTMLInputElement).value;
    const phone = (document.getElementById("Telefono") as HTMLInputElement).value;

    if (!telegram || !instagram || !phone) {
      this.error("Qualche campo è vuoto.");
      return;
    }
    if (!telegram.startsWith("@")) {
      this.error("Lo user telegram deve iniziare con @.");
      return;
    }
    if (!instagram.startsWith("@")) {
      this.error("Lo user instagram deve iniziare con @.");
      return;
    }
    if (!/^\+\d{2}(\s?\d{10})$/.test(phone)) {
      this.error("Non hai fornito un numero di telefono valido.");
      return;
    }
    
    if (y && x) {
      y.classList.remove("fade-in");
      y.classList.add("fade-out-up");
      setTimeout(()=>{
        y.style.display = "none";
        x.style.display = "flex";
        this.initCamera();
      }, 450);
    }
  }

  async fadeoutcam(to: string) {
    try {
      await this.savedata();
      const x = document.getElementById("background");
      const y = document.getElementById("photo-block");
      if (x && y) {
        x.classList.remove("fade-in");
        x.classList.add("fade-out");
        y.classList.remove("fade-in");
        y.classList.add("fade-out-up");
        setTimeout(()=>{this.router.navigate(
          [to],
          { state: { complete: window.location.pathname } }
        )}, 450);
      }
    } catch (error: any) {
      this.error(error.message);
    }
  }

  async savedata(): Promise<void> {
    const telegram = (document.getElementById("Telegram") as HTMLInputElement).value;
    const instagram = (document.getElementById("Instagram") as HTMLInputElement).value;
    const phone = (document.getElementById("Telefono") as HTMLInputElement).value;

    try {
      const user: any = await firstValueFrom(this.authService.getUser());
      await this.db.updateItem("user", user.uid, {
        completed: true,
        telegram: telegram,
        instagram: instagram,
        phone: phone,
        verified: (!this.impossibletoverify)
      });
    } catch (error) {
      throw new Error("Errore durante il salvataggio dei dati: " + error.message);
    }
  }

  initCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        })
        .catch((err) => {
          this.error("Errore nell'attivazione della telecamera");
          this.impossibletoverify = true;
        });
    } else {
      this.error("Il dispositivo non supporta l'accesso alla telecamera");
      this.impossibletoverify = true;
    }
  }

  takePhoto() {
    const canvas = this.canvas.nativeElement;
    const video = this.video.nativeElement;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.photo = canvas.toDataURL('image/png');
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.fadeoutcam("access/login");
    }
  }

  error(message) {
    const error = document.getElementById("error-cmplt-2")
    error.style.display = "flex";
    this.message = message;
    setTimeout(()=>{error.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{error.classList.remove("fade-out-bubble"); error.style.display = "none"}, 2400);
  }
}
