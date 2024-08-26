import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../_interfaces/user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy{
  autenticazione;
  db;
  user: User;
  users: User[];
  search: string ="";
  refreshInterval;
  refresh: boolean = false;
  message: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadUserData();
      this.route.paramMap.subscribe(params => {
        this.search = params.get('data')!;
        (document.getElementById("search-field") as HTMLInputElement).value = this.search;
      });
      this.refreshInterval = setInterval(() => {
        this.search = (document.getElementById("search-field") as HTMLInputElement).value;
      }, 50);
    } catch (error) {
      throw error;
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private async loadUserData(): Promise<void> {
    try {
      const user: any = await firstValueFrom(this.authService.getUser());
      this.user = await firstValueFrom(this.firestore.getItem("user", user.uid));
      let allUsers = await firstValueFrom(this.firestore.getItems("user"));
      this.users = allUsers.filter(element => element.completed);
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
    setTimeout(()=>{this.router.navigateByUrl(to); }, 450);
    if(this.refresh)
      setTimeout(()=>{window.location.reload();}, 500);
  }

  deleteUselessInformation(obj) {
    delete obj.requests;
    delete obj.matched;
    return obj;
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

  async sendrequest(id: string): Promise<void> {
    (document.getElementById("button-"+id) as HTMLButtonElement).disabled = true;
    try {
      const user: any = await firstValueFrom(this.autenticazione.getUser());
      const [actualUser, targetUser]: [any, any] = await Promise.all([
        firstValueFrom(this.db.getItem("user", user.uid)),
        firstValueFrom(this.db.getItem("user", id))
      ]);
      let accepted_actual_user;
      let matched;
      let requests;
      let requests_actual_user;
      let matched_actual_user;
      if (actualUser.requests[id] !== undefined) {
        delete actualUser.requests[id];
        accepted_actual_user = actualUser.accepted;
        matched_actual_user = actualUser.matched
        requests_actual_user = actualUser.requests
        matched = targetUser.matched;
        accepted_actual_user.push(id);
        matched[user.uid] = this.deleteUselessInformation(actualUser);
        matched_actual_user[id] = this.deleteUselessInformation(targetUser);
        this.sendNotification(targetUser.surname+" "+targetUser.name)
        await this.db.updateItem("user", user.uid, { matched: matched_actual_user, requests: requests_actual_user, accepted: accepted_actual_user});
        await this.db.updateItem("user", id, { matched: matched});
        this.correct("Entrambi vi siete swipati; adesso avete fatto match.");
      } else {
        accepted_actual_user = actualUser.accepted;
        requests = targetUser.requests;
        requests[user.uid] = this.deleteUselessInformation(actualUser);
        accepted_actual_user.push(id);
        await this.db.updateItem("user", id, { requests: requests});
        await this.db.updateItem("user", actualUser.id, { accepted: accepted_actual_user});
        this.correct("Richiesta mandata con successo.");
      }
    } catch (error) {
      throw error;
    }
  }

  correct(message) {
    this.message = message;
    this.refresh = true;
    const correct = document.getElementById("correct");
    setTimeout(()=>{
      correct.style.display = "flex";
    }, 50);
    setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2050);
    setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"; 
      window.location.reload();}, 2450);
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
