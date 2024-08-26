import { Component, OnInit, Renderer2 } from '@angular/core';
import { DbService } from '../_services/db.service';
import { AuthService } from '../_services/authentication.service';
import { Group } from '../_interfaces/group';
import { firstValueFrom } from 'rxjs';
import { User } from '../_interfaces/user';

@Component({
  selector: 'app-groupswiper',
  templateUrl: './groupswiper.component.html',
  styleUrl: './groupswiper.component.css'
})
export class GroupswiperComponent implements OnInit{
  filterclicked: boolean = false; 
  scrolling: boolean = false;
  coordstart : number;
  id: number = 0;
  nummax: number = 5;

  user: User | undefined;
  vectorGroups: Group[] = [];
  accepted: string[];
  rejected: string[];
  actualcard;
  vectorImage: string[][] = [];
  autenticazione;
  db;
  isLoading: boolean = true;
  comuneThings: string[] = [];
  messagenotify: number = 0;
  requestnotify: number = 0;

  constructor(private renderer: Renderer2, private authService: AuthService, private firestore: DbService) {
    this.autenticazione = authService;
    this.db = firestore;

    this.renderer.listen('window', 'click', (e: Event) => {
      if(window.location.pathname.startsWith("/groupswiper")) {
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
      if(window.location.pathname == "/groupswiper" && this.isLoading == false) {
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
      if(window.location.pathname == "/groupswiper" && this.isLoading == false) {
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

    if(window.innerHeight <= 800) {
      this.nummax = 3;
    } else {
      this.nummax = 5;
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadUserData();
      setTimeout(() => {
        document.getElementById("overlay").classList.add("fade-out");
      }, 500);
      setTimeout(() => {
        this.isLoading = false;
      }, 700);
    } catch (error) {
      throw error;
    }
  }

  private matchesFilter(element: User): boolean {
    const medium_age = parseInt(localStorage.getItem("medium_age") || "NaN");
    const group_time = localStorage.getItem("group_time");
    const group_location = localStorage.getItem("grouplocation");

    return (
      (isNaN(medium_age) || (element.age < medium_age + 5 && element.age > medium_age - 5)) &&
      (group_time === null || group_time === "-" || element.locationAndTime.toLowerCase().indexOf(group_time.toLowerCase()) != -1) &&
      (group_location === null || group_location === "undefined" || element.locationAndTime.toLowerCase().indexOf(group_location.toLowerCase()) != -1)
    );
  }

  private findComuneThings() {
    if(this.actualcard != undefined && this.user != undefined) {
      var location_actual = this.actualcard.locationAndTime.split(",")[0].trim().toLowerCase().replace(/\s+/g, "");
      var time_actual = this.actualcard.locationAndTime.split(",")[1].trim().toLowerCase().replace(/\s+/g, "");
      var location_user = this.user.locationAndTime.split(",")[0].trim().toLowerCase().replace(/\s+/g, "");
      var time_user = this.user.locationAndTime.split(",")[1].trim().toLowerCase().replace(/\s+/g, "");
      if(location_actual == location_user)
        this.comuneThings.push("Luogo: "+this.actualcard.locationAndTime.split(",")[0].trim().replace(/\s+/g, ""));
      if(time_actual == time_user)
        this.comuneThings.push("Orario: "+this.actualcard.locationAndTime.split(",")[1].trim().replace(/\s+/g, ""));
    }
  }

  private async getImages(vector) {
    let returnvector: string[][] = [];
    for(let item of vector) {
      let vect: string[] = [];
      for(let userId of item.members) {
        let user: User = await firstValueFrom(this.firestore.getItem("user", userId));
        vect.push(user.profileImageURL);
      }
      returnvector.push(vect);
    }
    return returnvector;
  }

  private async loadUserData(): Promise<void> {
    try {
      const user : any = await firstValueFrom(this.authService.getUser());
      this.user = await firstValueFrom(this.firestore.getItem("user", user.uid));
      if (this.user) {
        this.accepted = this.user.accepted_groups;
        this.rejected = this.user.rejected_groups;
        await this.number_requests(this.user);
        await this.findNumOfGroups(this.user);
      }
      const allGroups = await firstValueFrom(this.firestore.getItems("group"));
      if(allGroups != undefined) {
        this.vectorGroups = allGroups.filter(element => this.accepted.indexOf(element.id) == -1 && this.rejected.indexOf(element.id) == -1 && this.matchesFilter(element));
        this.actualcard = this.vectorGroups[0];
        this.vectorImage = await this.getImages(this.vectorGroups);
        this.findComuneThings();
      } else {
        this.vectorGroups = [];
      }
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
        rejected_groups: this.rejected,
        accepted_groups: this.accepted
      });
      this.user = await firstValueFrom(this.db.getItem("user", user.uid));
    } catch (error) {
      throw error;
    }
  }

  async sendrequest(id: string): Promise<void> {
    try {
      const user: any = await firstValueFrom(this.autenticazione.getUser());
      const [actualUser, targetGroup]: [any, any] = await Promise.all([
        firstValueFrom(this.db.getItem("user", user.uid)),
        firstValueFrom(this.db.getItem("group", id))
      ]);
      let requests;
      requests = targetGroup.requests;
      requests[user.uid] = actualUser;
      await this.db.updateItem("group", id, { requests: requests});
      
    } catch (error) {
      throw error;
    }
  }

  async handleaccept(): Promise<void> {
    try {
      await this.sendrequest(this.vectorGroups[this.id].id);
      this.accepted.push(this.vectorGroups[this.id].id);
      this.id++;
      this.actualcard = this.vectorGroups[this.id];
      this.findComuneThings();
      await this.savedata();
    } catch (error) {
      throw error;
    }
  }

  async handlereject(): Promise<void> {
    try {
      this.rejected.push(this.vectorGroups[this.id].id);
      this.id++;
      this.actualcard = this.vectorGroups[this.id];
      this.findComuneThings();
      await this.savedata();
    } catch (error) {
      throw error;
    }
  }

  private numberkeys(obj) {
    return Object.keys(obj).length
  }

  find_number_requests(obj): Promise<number> {
    return new Promise(async (resolve) => {
      let total = 0;
      for (let groupID of obj.accepted_groups) {
        let group: Group = await firstValueFrom(this.firestore.getItem("group", groupID));
        if(group.members.indexOf(obj.id) != -1)
          total += this.numberkeys(group.requests);
      }
      resolve(total);
    });
  }

  find_number_groups(obj): Promise<number> {
    return new Promise(async (resolve) => {
      let total = 0;
      for (let groupID of obj.accepted_groups) {
        let group: Group = await firstValueFrom(this.firestore.getItem("group", groupID));
        if(group.members.indexOf(obj.id) != -1)
          total += 1;
      }
      resolve(total);
    });
  }

  async number_requests(obj) {
    await this.find_number_requests(obj).then((numero: number) => {
      this.requestnotify = numero;
    })
    .catch((errore) => {
      this.requestnotify = 0;
    });
  }

  async findNumOfGroups(obj) {
    await this.find_number_groups(obj).then((numero: number) => {
      this.messagenotify = numero;
    })
    .catch((errore) => {
      this.messagenotify = 0;
    });
  }
}
