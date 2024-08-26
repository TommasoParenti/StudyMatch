import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../_interfaces/user';
import { DbService } from '../../_services/db.service';
import { AuthService } from '../../_services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { Group } from '../../_interfaces/group';

@Component({
  selector: 'app-messages-g',
  templateUrl: './messages-g.component.html',
  styleUrl: './messages-g.component.css'
})
export class MessagesGComponent implements OnInit{
  autenticazione;
  db;
  user: User | undefined;
  accepted: Group[] = [];
  members: string[][] = [];

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
        for (const elementid of this.user.accepted_groups) {
          let vec: string[] = [];
          const group: Group = await firstValueFrom(this.firestore.getItem("group", elementid));
          if(group.members.indexOf(this.user.id) != -1) {
            this.accepted.push(group);
            for (const pearsonid of group.members) {  
              if(vec.length <= 3) {
                const pearson: User = await firstValueFrom(this.firestore.getItem("user", pearsonid));
                vec.push(pearson.name);
              } else {
                vec.push("+"+(vec.length-3));
                break;                          
              }
            }
            this.members.push(vec);
          }
        }     
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
