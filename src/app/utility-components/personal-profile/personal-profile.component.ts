import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';
import { User } from '../../_interfaces/user';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrl: './personal-profile.component.css'
})
export class PersonalProfileComponent implements OnInit{
  id: string;
  surname: string;
  name: string;
  age: number;
  location_time: string;
  description: string;
  instagram: string;
  telegram: string;
  phone: string;
  profileImageURL: string;
  slideIndex = 1;
  to: string;
  autenticazione;
  db;
  user: User | undefined;

  constructor(private router: Router, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;
    this.showSlides(this.slideIndex);
    if(window.location.pathname == "/userswiper/personal-profile")
      this.to = "/userswiper"
    else if (window.location.pathname == "/groupswiper/personal-profile")
      this.to = "/groupswiper"
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadUserData();
    } catch (error) {
      throw error;
    }
  }

  private async loadUserData(): Promise<void> {
    try {
      const user: any = await firstValueFrom(this.authService.getUser());
      this.id = user.uid;
      this.user = await firstValueFrom(this.firestore.getItem("user", this.id));
      if (this.user) {
        this.surname = this.user.surname;
        this.name = this.user.name;
        this.age = this.user.age;
        this.location_time = this.user.locationAndTime;
        this.description = this.user.description;
        this.instagram = this.user.instagram;
        this.telegram = this.user.telegram;
        this.phone = this.user.phone;
        this.profileImageURL = this.user.profileImageURL;
      }
    } catch (error) {
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

  fadeoutint() {
    var x = document.getElementById("active");
    if(x.getAttribute("name") == "profile") {
      x.firstElementChild.classList.remove("fade-in-left");
      x.firstElementChild.className += " fade-out-right";
    } else if(x.getAttribute("name") == "qr") {
      x.firstElementChild.classList.remove("fade-in-right");
      x.firstElementChild.className += " fade-out-left";
    }
  }

  plusSlides(n) {
    this.fadeoutint();
    setTimeout(()=>{
      var x = document.getElementById("active");
      if(x.getAttribute("name") == "profile") {
        x.firstElementChild.classList.remove("fade-out-right");
        x.firstElementChild.className += " fade-in-left";
      } else if(x.getAttribute("name") == "qr") {
        x.firstElementChild.classList.remove("fade-out-left");
        x.firstElementChild.className += " fade-in-right";
      }
      this.showSlides(this.slideIndex += n);
    }, 450);
  }

  currentSlide(n) {
    this.fadeoutint();
    setTimeout(()=>{
      var x = document.getElementById("active");
      if(x.getAttribute("name") == "profile") {
        x.firstElementChild.classList.remove("fade-out-right");
        x.firstElementChild.className += " fade-in-left";
      } else if(x.getAttribute("name") == "qr") {
        x.firstElementChild.classList.remove("fade-out-left");
        x.firstElementChild.className += " fade-in-right";
      }
      this.showSlides(this.slideIndex = n);
    }, 450);
  }

  showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    setTimeout(() => {
      let dots = document.getElementsByClassName("dot");
      if (n > slides.length) {this.slideIndex = 1}    
      if (n < 1) {this.slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides.item(i).style.display = "none";  
        slides.item(i).id = "none";  
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides.item(this.slideIndex-1).style.display = "block";  
      slides.item(this.slideIndex-1).id = "active";  
      dots[this.slideIndex-1].className += " active";
    }, 0);
  }
}
