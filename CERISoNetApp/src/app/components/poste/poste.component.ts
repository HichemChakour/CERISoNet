import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-poste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poste.component.html',
  styleUrl: './poste.component.css'
})
export class PosteComponent implements AfterViewInit {
  @Input() message: any;
  currentUserPseudo: string = document.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1] || '';
  currentUserId: number = parseInt(document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1] || '0', 10);

  constructor(private messageService: MessageService, private el: ElementRef) {}

  ngAfterViewInit(): void {
    const button = this.el.nativeElement.querySelector('[data-popover-target="popover-default"]');
    const popover = this.el.nativeElement.querySelector('#popover-default');
  
    if (button && popover) {
      createPopper(button, popover, {
        placement: 'top', // Positionnement du popover
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: this.el.nativeElement.querySelector('[data-popper-arrow]'),
            },
          },
          {
            name: 'offset',
            options: {
              offset: [0, 8], // Décalage entre le bouton et le popover
            },
          },
        ],
      });
  
      // Afficher le popover au survol
      button.addEventListener('mouseenter', () => {
        popover.classList.remove('invisible', 'opacity-0');
        popover.classList.add('visible', 'opacity-100');
      });
  
      // Masquer le popover lorsque la souris quitte le bouton ou le popover
      button.addEventListener('mouseleave', () => {
        popover.classList.remove('visible', 'opacity-100');
        popover.classList.add('invisible', 'opacity-0');
      });
  
      popover.addEventListener('mouseleave', () => {
        popover.classList.remove('visible', 'opacity-100');
        popover.classList.add('invisible', 'opacity-0');
      });
    }
  }

  hasLiked(): boolean {
    return this.message.likedBy?.some((id: number) => id === this.currentUserId);
  }

  toggleLike(): void {
    this.messageService.toggleLike(this.message._id, this.currentUserId).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.message.likedBy = this.message.likedBy.filter((userId: number) => userId !== this.currentUserId);
          this.message.likes--;
        } else {
          this.message.likedBy.push(this.currentUserId);
          this.message.likes++;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du like :', error);
      }
    });
  }
}