import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poste',
  standalone: true,
  imports: [],
  templateUrl: './poste.component.html',
  styleUrl: './poste.component.css'
})
export class PosteComponent {
  @Input() message: any; 
}