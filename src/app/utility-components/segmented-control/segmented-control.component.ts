import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-segmented-control',
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.css'
})
export class SegmentedControlComponent implements OnInit{
  @Input() textOne: string;
  @Input() textTwo: string;
  @Input() toFirst: string;
  @Input() toSecond: string;
  @Input() background: string;
  
  constructor(private router: Router) {
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        setTimeout(()=> {if(window.location.pathname == "/access/register" || window.location.pathname == "/access/register/complete-profile"  || window.location.pathname == "/access/register/end-complete-profile") {
          const labelTwo1 = document.getElementById("label-two-1");
          const labelTwo2 = document.getElementById("label-two-2");
          labelTwo2.classList.add("move-left");
          labelTwo2.classList.remove("move-right");
          if(this.background != "#EEEEEE") {
            labelTwo2.style.color = "white";
            labelTwo1.style.color = "black";
          }
          labelTwo2.style.fontWeight = "400";
          labelTwo1.style.fontWeight = "600";
          } else if(window.location.pathname == "/access/login"){
            const labelTwo1 = document.getElementById("label-two-1");
            const labelTwo2 = document.getElementById("label-two-2");
            labelTwo2.classList.remove("move-left");
            labelTwo2.classList.add("move-right");
            if(this.background != "#EEEEEE") {
              labelTwo1.style.color = "white";
              labelTwo2.style.color = "black";
            }
            labelTwo1.style.fontWeight = "400";
            labelTwo2.style.fontWeight = "600";
          }
        }, 250)
      }
    });
  }

  ngOnInit(): void {
    document.getElementById("segmented-controls").style.backgroundColor = this.background;
    const labelTwo2 = document.getElementById("label-two-2");
    const labelTwo1 = document.getElementById("label-two-1");
    if (this.router.url.includes(this.toFirst) && !labelTwo2.classList.contains("move-left")) {
      labelTwo2.classList.add("move-left");
      labelTwo2.classList.remove("move-right");
      if(this.background != "#EEEEEE") {
        labelTwo2.style.color = "white";
        labelTwo1.style.color = "black";
      }
      labelTwo2.style.fontWeight = "400";
      labelTwo1.style.fontWeight = "600";
    } else {
      if(this.background != "#EEEEEE") {
        labelTwo1.style.color = "white";
        labelTwo2.style.color = "black";
      }
    }
  }

  slide(event) {
    const labelTwo1 = document.getElementById("label-two-1");
    const labelTwo2 = document.getElementById("label-two-2");
    this.reset();
    if (event.target.id === "two-1") {
      labelTwo2.classList.add("move-left");
      labelTwo2.classList.remove("move-right");
      if(this.background!="#EEEEEE") {
        labelTwo2.style.color = "white";
        labelTwo1.style.color = "black";
      }
      var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
      scrollElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      setTimeout(()=>this.router.navigateByUrl(this.toFirst), 350);
    } else {
      labelTwo2.classList.add("move-right");
      labelTwo2.classList.remove("move-left");
      if(this.background!="#EEEEEE") {
        labelTwo1.style.color = "white";
        labelTwo2.style.color = "black";
      }
      var scrollElement = document.documentElement.scrollTop ? document.documentElement : document.body;
      scrollElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      setTimeout(()=>this.router.navigateByUrl(this.toSecond), 350);
    }
  }

  reset() {
    const labelTwo2 = document.getElementById("label-two-2");
    const labelTwo1 = document.getElementById("label-two-1");
    labelTwo2.style.color = "";
    labelTwo2.style.fontWeight = "";
    labelTwo1.style.color = "";
    labelTwo1.style.fontWeight = "";
  }
}
