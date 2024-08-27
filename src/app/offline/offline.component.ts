import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.css'
})
export class OfflineComponent implements OnInit{
  constructor(private router: Router) {}
  ngOnInit(): void {
    if(window.navigator.onLine) {
      this.router.navigate(["/access/login"]);
    }
  }

  reload() {
    window.location.reload();
  }
}
