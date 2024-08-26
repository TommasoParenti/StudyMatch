import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { User } from '../../_interfaces/user';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  autenticazione;
  db;
  user: User | undefined;
  accepted: string[];
  matched: { [key: string]: User } = {};

  constructor(private router: Router, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;
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
      const information: any = await firstValueFrom(this.firestore.getItems("user"));
      this.user = information.find(element => element.id === user.uid);
      if (this.user) {
        this.accepted = this.user.accepted;
        this.matched = this.user.matched;
        for (const element of information) {
          if (element.id !== user.uid && element.accepted.includes(user.uid) && this.user.accepted.includes(element.id)) {
            this.matched[element.id] = element;
          }
        }
        await this.firestore.updateItem("user", user.uid, { matched: this.matched });
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

  isEmpty(obj) {
    if(obj != undefined)
      return Object.keys(obj).length == 0;
    return true;
  }

  correctcopy() {
    const correct = document.getElementById("correct-copy");
    setTimeout(()=>{
      correct.style.display = "flex";
    }, 50);
    setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2050);
    setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"}, 2450);
  }

  copy(val) {
    navigator.clipboard.writeText(val);
    this.correctcopy();
  }
}
