import { Component, input, Input } from '@angular/core';
import { User } from '../../../_interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @Input() user: User | undefined;
}
