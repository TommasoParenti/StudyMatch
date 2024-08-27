import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'StudyMatch';    
  
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if(!window.navigator.onLine) {
      this.router.navigate(["/offline"]);
    }
  }
}
