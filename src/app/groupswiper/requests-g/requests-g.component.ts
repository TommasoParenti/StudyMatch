import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../_interfaces/user';
import { DbService } from '../../_services/db.service';
import { AuthService } from '../../_services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { Group } from '../../_interfaces/group';

@Component({
  selector: 'app-requests-g',
  templateUrl: './requests-g.component.html',
  styleUrl: './requests-g.component.css'
})
export class RequestsGComponent {
  autenticazione;
  db;
  user: User | undefined;
  groups: { [key: string]: Group } = {};
  requests: {[id: string]: ({id: string, profileImageURL: string, surname: string, name: string, age: number, locationAndTime: string, city: string, faculty: string, namegroup: string})} = {};

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
      const information: any = await firstValueFrom(this.db.getItem("user", user.uid));
      this.user = information;
      for(let groupId of this.user.accepted_groups) {
        const group: Group = await firstValueFrom(this.db.getItem("group", groupId));
        if(group.members.indexOf(this.user.id) != -1) {
          this.groups[group.id] = group;
          for(let element in group.requests) {
            this.requests[element+","+group.id] = {id: element+","+group.id, profileImageURL: group.requests[element].profileImageURL, surname: group.requests[element].surname, name: group.requests[element].name, age: group.requests[element].age, locationAndTime: group.requests[element].locationAndTime, city: group.requests[element].city, faculty: group.requests[element].faculty, namegroup: group.name}
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async savedata(id: string): Promise<void> {
    try {
        await this.db.updateItem("group", id, {
            medium_age: this.groups[id].medium_age,
            members: this.groups[id].members,
            rejected: this.groups[id].rejected,
            requests: this.groups[id].requests
        });
    } catch (error) {
        throw error;
    }
  }

  sendNotification() {
    if("Notification" in window && Notification.permission == "granted") {
      var notification = new Notification("Nuovo membro del gruppo!", {
        lang: "it",
        body: "E' stato appena accettato un nuovo membro nel gruppo ",
        icon: "studymatch.ico"
      });
      Notification.requestPermission().then((result) => {
        if(result === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Nuovo membro del gruppo!", {
              lang: "it",
              body: "E' stato appena accettato un nuovo membro nel gruppo ",
              icon: "studymatch.ico"
            });
          })
        }
      })
    }
  }

  accept(id, age) {
    let [userId, groupId] = id.split(",");
    document.getElementById("profile-" + id).classList.add("fade-out");
    setTimeout(async () => {
        this.groups[groupId].members.push(userId);
        this.groups[groupId].medium_age = Math.floor((this.groups[groupId].medium_age + age) / 2);
        delete this.groups[groupId].requests[userId];
        delete this.requests[id];
        this.sendNotification()
        await this.savedata(groupId);
        window.location.reload();
    }, 300);
  }

  reject(id) {
    let [userId, groupId] = id.split(",");
    document.getElementById("profile-" + id).classList.add("fade-out");
    setTimeout(async () => {
        this.groups[groupId].rejected.push(userId);
        delete this.groups[groupId].requests[userId];
        delete this.requests[id];
        await this.savedata(groupId);
        window.location.reload();
    }, 300);
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
}
