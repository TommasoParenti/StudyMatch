import { AfterViewInit, Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-card-g',
  templateUrl: './card-g.component.html',
  styleUrl: './card-g.component.css'
})
export class CardGComponent implements AfterViewInit{
  @Input() number: number;
  @Input() imagevector: string[];
  click: boolean = false;
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
      if(window.location.pathname == "/groupswiper" && actualcard != undefined) {
        actualcard.classList.add("grab");
        document.getElementsByClassName("cards")[0].classList.remove("grabbed");
        window.removeEventListener('mousemove', movemouseUniqueListener);
        if(card.style.transform != "rotate(5deg) translateX(200px)" && card.style.transform != "rotate(-5deg) translateX(-200px)") {
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
      if(window.location.pathname == "/groupswiper") {
        window.removeEventListener('touchmove', movetouchUniqueListener);
        if(card.style.transform != "rotate(5deg) translateX(200px)" && card.style.transform != "rotate(-5deg) translateX(-200px)") {
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

    setTimeout(() => {
      console.log(this.imagevector);
  
      if(this.imagevector.length == 1) {
        document.getElementById("img-0").classList.add("oneImage");
      } else if(this.imagevector.length == 2) {
        document.getElementById("img-0").classList.add("twoImages");
        document.getElementById("img-1").classList.add("twoImages");
      } else if(this.imagevector.length == 3) {
        document.getElementById("img-0").classList.add("threeImages");
        document.getElementById("img-1").classList.add("threeImages"); 
        document.getElementById("img-2").classList.add("threeImages");
      }
    },500)
  }

  accept() {
    var card = document.getElementById("card-"+this.number);
    if(card!= null)
      setTimeout(()=>{
        card.classList.add("fade-out");
        this.accepted.emit();
      }, 100);                  
  }
  
  reject() {
    var card = document.getElementById("card-"+this.number);
    if(card!= null)
      setTimeout(()=>{
        card.classList.add("fade-out");
        this.rejected.emit();
      }, 100);
  }

  movemouse(number) {
    var card = document.getElementById("card-"+number);
    return function(e) {
      var cordsX = e.clientX;
      var initialx = card.getBoundingClientRect().left;
      if(cordsX > (initialx+(card.clientWidth/2))) {
        if((cordsX-(initialx+(card.clientWidth/2)))<200) {
          card.style.transform = "rotate(5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(5deg) translateX(200px)";
          card.classList.remove("red");
          card.classList.add("green");
        }
      }
      else {
        if((cordsX-(initialx+(card.clientWidth/2)))>-200) {
          card.style.transform = "rotate(-5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(-5deg)  translateX(-200px)";
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
      if(cordsX > (initialx+(card.clientWidth/2))) {
        if((cordsX-(initialx+(card.clientWidth/2)))<200) {
          card.style.transform = "rotate(5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(5deg) translateX(200px)";
          card.classList.remove("red");
          card.classList.add("green");
        }
      }
      else {
        if((cordsX-(initialx+(card.clientWidth/2)))>-200) {
          card.style.transform = "rotate(-5deg) translateX("+(cordsX-(initialx+(card.clientWidth/2)))+"px)";
          card.classList.remove("red");
          card.classList.remove("green");
        }
        else {
          card.style.transform = "rotate(-5deg)  translateX(-200px)";
          card.classList.remove("green");
          card.classList.add("red");
        }
      }
    };
  }
}
