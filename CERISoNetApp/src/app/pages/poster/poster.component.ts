import { Component } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poster',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './poster.component.html',
  styleUrl: './poster.component.css'
})
export class PosterComponent {
  message: { body: string; imageUrl: string; imageTitle: string; hashtags: string[] | null } = {
    body: '',
    imageUrl: '',
    imageTitle: '',
    hashtags: []
  };

  constructor(private messageService: MessageService) {}

  postMessage() {
    const userId = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];

    const messageData = {
      userId,
      body: this.message.body,
      imageUrl: this.message.imageUrl,
      imageTitle: this.message.imageTitle,
      hashtags: this.message.hashtags
    };

    this.messageService.createMessage(messageData).subscribe({
      next: (response) => {
        console.log('Message posted successfully:', response);
      },
      error: (error) => {
        console.error('Error posting message:', error);
      }
    });
  }

  addHashtag() {
    const hashtagElement = document.getElementById('hashtags') as HTMLInputElement;
    if (hashtagElement && hashtagElement.value) {
      if (Array.isArray(this.message.hashtags)) {
        this.message.hashtags.push("#"+hashtagElement.value);
      } else {
        console.error('Hashtags is not an array');
      }
      console.log(this.message.hashtags);
    }
  }

  
}