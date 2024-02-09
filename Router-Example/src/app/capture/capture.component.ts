import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-capture',
  standalone: true,
  imports: [],
  templateUrl: './capture.component.html',
  styleUrl: './capture.component.css'
})
export class CaptureComponent {
  @ViewChild('videoElement') videoElement: ElementRef | undefined;
  @ViewChild('audioElement') audioElement: ElementRef | undefined;

  async startCapture() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
      if (this.audioElement) {
        this.audioElement.nativeElement.srcObject = stream;
      }
      // You might not need the audio element to play through separately if capturing both video and audio
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }
}
