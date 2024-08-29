import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.css'
})
export class QrCodeComponent implements OnInit {
  @Input() name:string;
  qrcodeSrc:string = "";

  ngOnInit(): void {
    setTimeout(()=>this.qrcodeSrc = "http://api.qrserver.com/v1/create-qr-code/?data=https://studymatch-99924.firebaseapp.com/userswiper/search/" + this.name, 300);
  }
}
