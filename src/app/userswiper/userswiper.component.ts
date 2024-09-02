import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/authentication.service';
import { DbService } from '../_services/db.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../_interfaces/user';

@Component({
  selector: 'app-userswiper',
  templateUrl: './userswiper.component.html',
  styleUrl: './userswiper.component.css'
})
export class UserswiperComponent implements OnInit{  
  filterclicked: boolean = false; 
  scrolling: boolean = false;
  coordstart : number;
  id: number = 0;
  vectorUsers: User[] = [];
  accepted: string[];
  rejected: string[];
  autenticazione;
  db;
  user: User | undefined;
  actualcard;
  isLoading: boolean = true;
  comuneThings: string[] = [];
  message: string;

  constructor(private router: Router, private renderer: Renderer2, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;

    this.renderer.listen('window', 'click', (e: Event) => {
      if(window.location.pathname.startsWith("/userswiper")) {
        var x = document.getElementsByTagName("app-filter")[0] as HTMLElement;
        var y = document.getElementsByTagName("app-navbar")[0].lastChild.lastChild.childNodes[8] as HTMLElement;
        if (this.filterclicked == true && !x.contains(e.target as Node) && !y.contains(e.target as Node)) {
          x.classList.remove("fade-in");
          x.classList.add("fade-out");
          setTimeout(()=>{x.style.display="none";x.classList.add("fade-in"); x.classList.remove("fade-out");}, 200);
          this.filterclicked = false;
        }
      }
    });

    this.renderer.listen('window', 'wheel', (e: WheelEvent) => {
      if(window.location.pathname == "/userswiper" && this.isLoading == false) {
        if(e.deltaY > 0) {
          var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
          scrollElement.scrollTo({
              top: scrollElement.scrollTop + window.innerHeight,
              behavior: 'smooth'
            });
        } else {
          var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
          scrollElement.scrollTo({
            top: scrollElement.scrollTop - window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    });

    this.renderer.listen('window', 'touchstart', (e: TouchEvent) => {
      this.coordstart = e.touches[0].clientY;
    });

    this.renderer.listen('window', 'touchmove', (e: TouchEvent) => {
      if(window.location.pathname == "/userswiper" && this.isLoading == false) {
        if(e.touches[0].clientY - this.coordstart + 100 < 0) {
          var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
          scrollElement.scrollTo({
              top: scrollElement.scrollTop + window.innerHeight,
              behavior: 'smooth'
            });
        } else if(this.coordstart - e.touches[0].clientY + 100 < 0) {
          var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
          scrollElement.scrollTo({
            top: scrollElement.scrollTop - window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    });

  }
     
  async ngOnInit(): Promise<void> {
    try {
      await this.loadUserData();
      setTimeout(() => {
        document.getElementById("overlay").classList.add("fade-out");
        setTimeout(() => {
          this.isLoading = false;
          if(!("Notification" in window)) {
            this.error("Questo dispositivo non supporta le notifiche.");
          } else if(Notification.permission == "default"){
            const notify = document.getElementById("notify");
            notify.style.display = "flex";
          }
        }, 200);
      }, 500);
    } catch (error) {
      throw error;
    }
  }

  private matchesFilter(element: User): boolean {
    const age = parseInt(localStorage.getItem("age") || "NaN");
    const time = localStorage.getItem("time");
    const location = localStorage.getItem("location");
    const city = localStorage.getItem("city");
    const faculty = localStorage.getItem("faculty");

    return (
      (isNaN(age) || (element.age < age + 5 && element.age > age - 5)) &&
      (time === null || time === "-" || element.locationAndTime.toLowerCase().indexOf(time.toLowerCase()) != -1) &&
      (location === null || location === "" || element.locationAndTime.toLowerCase().indexOf(location.toLowerCase()) != -1) &&     
      (city === null || city === "" || element.city.toLowerCase().indexOf(city.toLowerCase()) != -1) &&     
      (faculty === null || faculty === "" || element.faculty.toLowerCase().indexOf(faculty.toLowerCase()) != -1)
    );
  }

  private findComuneThings() {
    this.comuneThings = [];
    if(this.actualcard != undefined && this.user != undefined) {
      var location_actual = this.actualcard.locationAndTime.split(",")[0].trim().toLowerCase().replace(/\s+/g, "");
      var time_actual = this.actualcard.locationAndTime.split(",")[1].trim().toLowerCase().replace(/\s+/g, "");
      var location_user = this.user.locationAndTime.split(",")[0].trim().toLowerCase().replace(/\s+/g, "");
      var time_user = this.user.locationAndTime.split(",")[1].trim().toLowerCase().replace(/\s+/g, "");
      var city_user = this.user.city.split(",")[0].trim().toLowerCase().replace(/\s+/g, "");
      var city_actual = this.actualcard.city.trim().toLowerCase().replace(/\s+/g, "");
      var faculty_user = this.user.faculty.trim().toLowerCase().replace(/\s+/g, "");
      var faculty_actual = this.actualcard.faculty.trim().toLowerCase().replace(/\s+/g, "");

      if(location_actual == location_user)
        this.comuneThings.push("Luogo: "+this.actualcard.locationAndTime.split(",")[0].trim());
      if(time_actual == time_user)
        this.comuneThings.push("Orario: "+this.actualcard.locationAndTime.split(",")[1].trim());
      if(city_actual == city_user)
        this.comuneThings.push("Città: "+this.actualcard.city.trim());
      if(faculty_actual == faculty_user)
        this.comuneThings.push("Facoltà: "+this.actualcard.faculty.trim());
    }
  }

  private async loadUserData(): Promise<void> {
    try {
      const user : any = await firstValueFrom(this.authService.getUser());
      this.user = await firstValueFrom(this.firestore.getItem("user", user.uid));
      if (this.user) {
        this.accepted = this.user.accepted;
        this.rejected = this.user.rejected;
      }
      const allUsers = await firstValueFrom(this.firestore.getItems("user"));
      this.vectorUsers = allUsers.filter(element => element.id !== user.uid && element.completed && this.accepted.indexOf(element.id) == -1 && this.rejected.indexOf(element.id) == -1 && this.matchesFilter(element));
      this.actualcard = this.vectorUsers[0];
      this.findComuneThings();
    } catch (error) {
      throw error;
    }
  }

  reciveclick(e) {
    this.filterclicked = e;
    var x = document.getElementsByTagName("app-filter")[0] as HTMLElement;
    if(this.filterclicked) {
      x.style.display="block";
    } else {
      x.classList.remove("fade-in");
      x.classList.add("fade-out");
      setTimeout(()=>{x.style.display="none";x.classList.add("fade-in"); x.classList.remove("fade-out");}, 200);
    }
  }

  async savedata(): Promise<void> {
    try {
      const user: any = await firstValueFrom(this.autenticazione.getUser());
      await this.db.updateItem("user", user.uid, {
        rejected: this.rejected,
        accepted: this.accepted
      });
      this.user = await firstValueFrom(this.db.getItem("user", user.uid));
    } catch (error) {
      throw error;
    }
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
    try {
      const user: any = await firstValueFrom(this.autenticazione.getUser());
      const [actualUser, targetUser]: [any, any] = await Promise.all([
        firstValueFrom(this.db.getItem("user", user.uid)),
        firstValueFrom(this.db.getItem("user", id))
      ]);
      let matched;
      let requests;
      let requests_actual_user;
      let matched_actual_user;
      if (actualUser.requests[id] !== undefined) {
        delete actualUser.requests[id];
        matched_actual_user = actualUser.matched
        requests_actual_user = actualUser.requests
        matched = targetUser.matched;
        delete targetUser.matched;
        matched[user.uid] = this.deleteUselessInformation(actualUser);
        matched_actual_user[id] = this.deleteUselessInformation(targetUser);
        this.sendNotification(targetUser.surname+" "+targetUser.name);
        await this.db.updateItem("user", user.uid, { matched: matched_actual_user, requests: requests_actual_user});
        await this.db.updateItem("user", id, { matched: matched});
      } else {
        if (targetUser.accepted.indexOf(user.uid) != -1) {
          matched = targetUser.matched;
          matched_actual_user = actualUser.matched
          delete targetUser.matched;
          matched[user.uid] = this.deleteUselessInformation(actualUser);
          matched_actual_user[id] = this.deleteUselessInformation(targetUser);
          this.sendNotification(targetUser.surname+" "+targetUser.name);
          await this.db.updateItem("user", user.uid, { matched: matched_actual_user});
          await this.db.updateItem("user", id, { matched: matched});
        } else {
          requests = targetUser.requests;
          requests[user.uid] = this.deleteUselessInformation(actualUser);
          await this.db.updateItem("user", id, { requests: requests});
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async handleaccept(): Promise<void> {
    try {
      await this.sendrequest(this.vectorUsers[this.id].id);
      this.accepted.push(this.vectorUsers[this.id].id);
      await this.savedata();
      this.id++;
      this.actualcard = this.vectorUsers[this.id];
      this.findComuneThings();
    } catch (error) {
      throw error;
    }
  }

  async handlereject(): Promise<void> {
    try {
      this.rejected.push(this.vectorUsers[this.id].id);
      await this.savedata();
      this.id++;
      this.actualcard = this.vectorUsers[this.id];
      this.findComuneThings();
    } catch (error) {
      throw error;
    }
  }

  error(message) {
    const error = document.getElementById("error");
    error.style.display = "flex";
    this.message = message;
    setTimeout(()=>{error.classList.add("fade-out-bubble");}, 2000);
    setTimeout(()=>{error.classList.remove("fade-out-bubble"); error.style.display = "none"}, 2400);
  }

  requestNotifies(request) {
    const notify = document.getElementById("notify");
    if(request) {
      Notification.requestPermission().then((permission) => {
        setTimeout(()=>{notify.classList.add("fade-out-bubble");}, 100);
        setTimeout(()=>{notify.classList.remove("fade-out-bubble"); notify.style.display = "none"}, 500);
      })
    } else {
      setTimeout(()=>{notify.classList.add("fade-out-bubble");}, 100);
      setTimeout(()=>{notify.classList.remove("fade-out-bubble"); notify.style.display = "none"}, 500);
    }
  }

  numberkeys(obj) {
    return Object.keys(obj).length
  }
}   
