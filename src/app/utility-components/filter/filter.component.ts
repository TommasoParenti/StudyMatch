import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @ViewChild('location') location: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('faculty') faculty: ElementRef;
  outlineb: boolean = false;
  outlinebc: boolean = false;
  outlinebf: boolean = false;
  agevalue: number;
  timevalue_1: string = "";
  timevalue_2: string = "";
  locationvalue: string = "";
  cityvalue: string = "";
  facultyvalue: string = "";
  mouseX: number;
  mouseY: number;
  group: boolean;

  constructor(private renderer: Renderer2) {
    if(window.location.pathname.includes("groupswiper")) {
      this.group = true;
    } else {
      this.group = false;
    }

    if(localStorage.getItem("time") != null) {
      this.timevalue_1 = localStorage.getItem("time").split("-")[0]+":00";
      this.timevalue_2 = localStorage.getItem("time").split("-")[1]+":00";
    }
    if(localStorage.getItem("location") != null) {
      this.locationvalue = localStorage.getItem("location");
    }
    if(localStorage.getItem("city") != null) {
      this.cityvalue = localStorage.getItem("city");
    }
    if(localStorage.getItem("faculty") != null) {
      this.facultyvalue = localStorage.getItem("faculty");
    }

    this.renderer.listen('window', 'click', (e: Event) => {
      var x = document.getElementById("location");
      if (this.outlineb == true && e.target !== this.location.nativeElement.children[0] && e.target !== this.location.nativeElement.children[1] && e.target !== this.location.nativeElement.children[0].children[0]) {
        x.classList.remove("outline");
        this.outlineb = false;
      }

      var z = document.getElementById("city");
      var y = document.getElementById("faculty");
      if(z != undefined && y !=undefined) {
        if (this.outlinebc == true && e.target !== this.city.nativeElement.children[0] && e.target !== this.city.nativeElement.children[1] && e.target !== this.city.nativeElement.children[0].children[0]) {
          z.classList.remove("outline");
          this.outlinebc = false;
        }
        if (this.outlinebf == true && e.target !== this.faculty.nativeElement.children[0] && e.target !== this.faculty.nativeElement.children[1] && e.target !== this.faculty.nativeElement.children[0].children[0]) {
          y.classList.remove("outline");
          this.outlinebf = false;
        }
      }
    });

    if(!isNaN(parseInt(localStorage.getItem("age"))))
      this.agevalue=parseInt(localStorage.getItem("age"));
  }

  outline() {
    var x = document.getElementById("location");
    x.classList.add("outline");
    this.outlineb = true;
  }

  outlinec() {
    var x = document.getElementById("city");
    x.classList.add("outline");
    this.outlinebc = true;
  }

  outlinef() {
    var x = document.getElementById("faculty");
    x.classList.add("outline");
    this.outlinebf = true;
  }

  captureMouseEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  floatlabel(e: any) {
    this.agevalue = e.target.value;
    var x = document.getElementById("float-bubble");
    var range = document.getElementById("age");
    var min = document.getElementById("age").getBoundingClientRect().x;
    x.style.display="block";                  
    x.style.left= (this.mouseX)- min + 0.5 +"px";  
    range.setAttribute("disabled",""); 

    setTimeout(() => {
      x.classList.remove("fade-in");
      x.classList.add("fade-out");
    }, 1000);
    setTimeout(() => {
      x.style.display="none";
      range.removeAttribute("disabled"); 
      x.classList.remove("fade-out");
      x.classList.add("fade-in");
    }, 1100);
  }

  filter() { 
    var time_1 = (document.getElementById("time-1") as HTMLInputElement).value.split(":")[0];
    var time_2 = (document.getElementById("time-2") as HTMLInputElement).value.split(":")[0];
    var location = (document.getElementById("locationsearch") as HTMLInputElement).value;
    var city = (document.getElementById("citysearch") as HTMLInputElement)?.value;
    var faculty = (document.getElementById("facultysearch") as HTMLInputElement)?.value;
    var age = (document.getElementById("age") as HTMLInputElement).value;

    localStorage.setItem("age", age);
    localStorage.setItem("location", location);
    localStorage.setItem("city", city);
    localStorage.setItem("faculty", faculty);
    localStorage.setItem("time", time_1+"-"+time_2);
    window.location.reload();
  }

  reset() { 
    localStorage.removeItem("age");
    localStorage.removeItem("location");
    localStorage.removeItem("city");
    localStorage.removeItem("faculty");
    localStorage.removeItem("time");
    window.location.reload();
  }
}
