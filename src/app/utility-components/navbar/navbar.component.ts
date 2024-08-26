import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../_interfaces/user';
import { AuthService } from '../../_services/authentication.service';
import { LoggedService } from '../../_services/logged.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnChanges{
  imageurl = "assets/school.png";
  @Input() filterclicked: boolean;
  @Input() group: boolean;
  @Input() profileimage: string;
  @Input() messagesnotify: number;
  @Input() requestsnotify: number;
  @Input() user: User | undefined;
  @Output() reciveclick:EventEmitter<boolean> = new EventEmitter<boolean>();
  autenticazione;

  constructor(private router: Router, private authService: AuthService, private login: LoggedService) {
    this.autenticazione = authService;
  }

  ngOnInit(): void {
    if(this.group == false) {
      document.getElementById("add-group").style.cssText = 'display:none !important';
      document.getElementById("label-add-group").style.cssText = 'display:none !important';
    }
  } 

  ngOnChanges(changes: SimpleChanges): void {
    if(this.messagesnotify == 0) {
      document.getElementById("messages").getElementsByTagName("span")[0].style.display="none";
    } else if(this.messagesnotify > 0 && this.messagesnotify <= 9) {
      document.getElementById("messages").getElementsByTagName("span")[0].style.display="inherit";
    } else if(this.messagesnotify > 9) {
      document.getElementById("messages").getElementsByTagName("span")[0].style.display="inherit";
      document.getElementById("messages").getElementsByTagName("span")[0].textContent = "9+";
    }
    if(this.requestsnotify == 0) {
      document.getElementById("accept-request").getElementsByTagName("span")[0].style.display="none";
    } else if(this.requestsnotify > 0 && this.requestsnotify <= 9) {
      document.getElementById("accept-request").getElementsByTagName("span")[0].style.display="inherit";
    } else if(this.requestsnotify > 9) {
      document.getElementById("messages").getElementsByTagName("span")[0].style.display="inherit";
      document.getElementById("accept-request").getElementsByTagName("span")[0].textContent = "9+";
    }
  }

  mobile() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
      x.className += " fade-in-right";
    } else {
      x.classList.remove("fade-in-right");
      x.className += " fade-out-left";
      setTimeout(() => {x.className = "topnav";}, 450)
    }
  }

  sendclick() {
    this.filterclicked = !this.filterclicked;
    this.reciveclick.emit(this.filterclicked);
  }

  async logout() {
    await this.authService.logout();
    this.login.logout();
    await this.router.navigate(['access/login']); 
  }
}
