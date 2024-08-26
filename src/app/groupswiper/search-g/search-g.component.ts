import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../_interfaces/user';
import { AuthService } from '../../_services/authentication.service';
import { DbService } from '../../_services/db.service';
import { firstValueFrom } from 'rxjs';
import { Group } from '../../_interfaces/group';

@Component({
  selector: 'app-search-g',
  templateUrl: './search-g.component.html',
  styleUrl: './search-g.component.css'
})
export class SearchGComponent implements OnInit, OnDestroy{
  autenticazione;
  db;
  user: User;
  groups: Group [];
  search: string ="";
  refreshInterval;
  refresh: boolean = false;

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
      this.groups = await firstValueFrom(this.firestore.getItems("group"));
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

  async sendrequest(id: string): Promise<void> {
    (document.getElementById("button-"+id) as HTMLButtonElement).disabled = true;
    try { 
      const user: any = await firstValueFrom(this.autenticazione.getUser());
      const [actualUser, targetGroup]: [any, any] = await Promise.all([
        firstValueFrom(this.db.getItem("user", user.uid)),
        firstValueFrom(this.db.getItem("group", id))
      ]);
      let accepted;
      let requests;
      accepted = actualUser.accepted_groups;
      requests = targetGroup.requests;
      requests[user.uid] = actualUser;
      accepted.push(id);
      await this.db.updateItem("user", user.uid, { accepted_groups: accepted});
      await this.db.updateItem("group", id, { requests: requests});
      
      this.correct();
    } catch (error) {
      throw error;
    }
  }

  correct() {
    this.refresh = true;
    const correct = document.getElementById("correct");
    setTimeout(()=>{
      correct.style.display = "flex";
    }, 50);
    setTimeout(()=>{correct.classList.add("fade-out-bubble");}, 2050);
    setTimeout(()=>{correct.classList.remove("fade-out-bubble"); correct.style.display = "none"; window.location.reload();}, 2450);
  }
}
