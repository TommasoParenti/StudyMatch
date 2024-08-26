import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { User } from '../../_interfaces/user';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit{
  autenticazione;
  db;
  user: User | undefined;
  requests: {User};
  accepted: string[];
  rejected: string[];

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
      this.requests = information.requests;
      this.accepted = information.accepted;
      this.rejected = information.rejected;
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

  async savedata(id: string): Promise<void> {
    try {
        const requestsNew: any = { ...this.requests }; 
        if(requestsNew[id] != null || requestsNew[id] != undefined)
          delete requestsNew[id];
        const user: any = await firstValueFrom(this.autenticazione.getUser());
        await this.db.updateItem("user", user.uid, {
            rejected: this.rejected,
            accepted: this.accepted,
            requests: requestsNew
        });
        const information: User = await firstValueFrom(this.db.getItem("user", user.uid));
        this.user = information;
    } catch (error) {
        throw error;
    }
  }

  sendNotification(user: string) {
    if("Notification" in window && Notification.permission == "granted") {
      var notification = new Notification("Match!", {
        lang: "it",
        body: "Hai appena fatto un match con " + user,
        icon: "studymatch.ico"
      });
      Notification.requestPermission().then((result) => {
        if(result === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Match!", {
              lang: "it",
              body: "Hai appena fatto un match con " + user,
              icon: "studymatch.ico"
            });
          })
        }
      })
    }
  }

  async saveMatch(id: string): Promise<void> {
    try {
        const user: any = await firstValueFrom(this.autenticazione.getUser());
        const el: any = await firstValueFrom(this.db.getItem("user", user.uid));
        const information: any = await firstValueFrom(this.db.getItem("user", id));
        let accepted = information.accepted;
        let matched = information.matched || {};
        let matched_actual_user = el.matched || {};
        await delete el.matched;
        await delete information.matched;
        if (accepted.indexOf(user.uid) !== -1) {
            matched[user.uid] = el;
            matched_actual_user[information.id] = information;
            this.sendNotification(information.surname+" "+information.name);
            await this.db.updateItem("user", id, { matched: matched });
            await this.db.updateItem("user", user.uid, { matched: matched_actual_user });
        }
    } catch (error) {
        throw error;
    }
  }

  accept(id) {
    var saveRequestid = this.requests[id].id;
    document.getElementById("profile-" + saveRequestid).classList.add("fade-out");
    setTimeout(async () => {
        this.accepted.push(saveRequestid);
        await delete this.requests[id];
        await this.savedata(id);
        await this.saveMatch(id);
        window.location.reload();
    }, 300);
  }

  reject(id) {
    var saveRequestid = this.requests[id].id;
    document.getElementById("profile-" + saveRequestid).classList.add("fade-out");
    setTimeout(async () => {
        this.rejected.push(saveRequestid);
        await delete this.requests[id];
        await this.savedata(id);
        window.location.reload();
    }, 300);
  } 

  isEmpty(obj) {
    if(obj != undefined)
      return Object.keys(obj).length == 0;
    return true;
  }
}
