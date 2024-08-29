import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { User } from '../../_interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements AfterViewInit {
  @Input() number: number;
  @Input() user: User | undefined;
  click: boolean = false;
  url = '../../../assets/image.png';
  @Output() rejected = new EventEmitter<string>();
  @Output() accepted = new EventEmitter<string>();
  
  constructor(private renderer: Renderer2) {}
  
  ngAfterViewInit(): void {
    var card = document.getElementById("card-"+this.number);
    const movemouseUniqueListener = this.movemouse(this.number);
    const movetouchUniqueListener = this.movetouch(this.number);
    document.getElementsByClassName("card")[0].classList.add("grab");

    window.addEventListener('pointerdown', (e: MouseEvent) => {
      if(e.target == document.getElementsByClassName("card")[0]) {
        document.getElementsByClassName("card")[0].classList.remove("grab");
        window.addEventListener('mousemove', movemouseUniqueListener);
        document.getElementsByClassName("cards")[0].classList.add("grabbed");
      }
    }, false);

    window.addEventListener('touchstart', (e: TouchEvent) => {
      if(e.target == document.getElementsByClassName("card")[0])
        window.addEventListener('touchmove', movetouchUniqueListener);
    }, false);
    
    window.addEventListener('pointerup', (e: MouseEvent) => {
      let actualcard = document.getElementsByClassName("card")[0];
      if(window.location.pathname == "/userswiper" && actualcard != undefined) {
        actualcard.classList.add("grab");
        document.getElementsByClassName("cards")[0].classList.remove("grabbed");
        window.removeEventListener('mousemove', movemouseUniqueListener);
        var max = 200;
        if(window.innerWidth > 500) {
          max = 200;
        } else if(window.innerWidth <= 500) {
          max = 80;
        }
        if(card.style.transform != "rotate(5deg) translateX("+max+"px)" && card.style.transform != "rotate(-5deg) translateX(-"+max+"px)") {
          setTimeout(()=>{
              card.style.transform = "translateX(0px)";   
              card.classList.remove("red");  
              card.classList.remove("green");}
            , 200)
        } else {
          if(e.clientX > (card.getBoundingClientRect().left+(card.clientWidth/2)))
            this.accept();
          else if(e.clientX < (card.getBoundingClientRect().left+(card.clientWidth/2)))
            this.reject();
        }
      }
    }, false);

    window.addEventListener('touchend', (e: TouchEvent) => {
      if(window.location.pathname == "/userswiper") {
        window.removeEventListener('touchmove', movetouchUniqueListener);
        var max = 200;
        if(window.innerWidth > 500) {
          max = 200;
        } else if(window.innerWidth <= 500) {
          max = 80;
        }
        if(card.style.transform != "rotate(5deg) translateX("+max+"px)" && card.style.transform != "rotate(-5deg) translateX(-"+max+"px)") {
          setTimeout(()=>{
              card.style.transform = "translateX(0px)";   
              card.classList.remove("red");  
              card.classList.remove("green");}
            , 200)
        } else {
          if(e.changedTouches[0].clientX > (card.getBoundingClientRect().left+(card.clientWidth/2)))
            this.accept();
          else if(e.changedTouches[0].clientX < (card.getBoundingClientRect().left+(card.clientWidth/2)))
            this.reject();
        }
      }
    }, false);
  }

  accept() {
    var card = document.getElementById("card-"+this.number);
    if(card!= null)
      card.classList.add("fade-out");
      setTimeout(()=>{
        this.accepted.emit();
      }, 150);                  
  }
  
  reject() {
    var card = document.getElementById("card-"+this.number);
    if(card!= null)
      card.classList.add("fade-out");
      setTimeout(()=>{
        this.rejected.emit();
      }, 150);
  }

  movemouse(number) {
    var card = document.getElementById("card-"+number);
    return function(e) {
      var cordsX = e.clientX;
      var initialx = card.getBoundingClientRect().left;
      var max = 200;
      if(window.innerWidth > 500) {
        max = 200;
      } else if(window.innerWidth <= 500) {
        max = 80;
      }
      if(cordsX > (initialx+(card.clientWidth/2))) {
        if((cordsX-(initialx+(card.clientWidth/2)))<max) {
          card.style.transform = "rotate(5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(5deg) translateX("+max+"px)";
          card.classList.remove("red");
          card.classList.add("green");
        }
      }
      else {
        if((cordsX-(initialx+(card.clientWidth/2)))>-max) {
          card.style.transform = "rotate(-5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(-5deg)  translateX(-"+max+"px)";
          card.classList.remove("green");
          card.classList.add("red");
        }
      }
    };
  }

  movetouch(number) {
    var card = document.getElementById("card-"+number);
    return function(e) {
      var cordsX = e.touches[0].clientX;
      var initialx = card.getBoundingClientRect().left;
      var max = 200;
      if(window.innerWidth > 500) {
        max = 200;
      } else if(window.innerWidth <= 500) {
        max = 80;
      }
      if(cordsX > (initialx+(card.clientWidth/2))) {
        if((cordsX-(initialx+(card.clientWidth/2)))<max) {
          card.style.transform = "rotate(5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(5deg) translateX("+max+"px)";
          card.classList.remove("red");
          card.classList.add("green");
        }
      }
      else {
        if((cordsX-(initialx+(card.clientWidth/2)))>-max) {
          card.style.transform = "rotate(-5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(-5deg)  translateX(-"+max+"px)";
          card.classList.remove("green");
          card.classList.add("red");
        }
      }
    };
  }
}
