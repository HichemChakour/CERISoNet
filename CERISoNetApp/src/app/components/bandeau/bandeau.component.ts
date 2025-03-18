import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bandeau',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnChanges {
  @Input() message: string = '';
  @Input() isSuccess: boolean = false;
  @Input() messageId: number = 0;
  isVisible: boolean = false;
  //affichage quand il y a un nouveau message
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messageId'] && this.messageId) {
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    }
  }
}