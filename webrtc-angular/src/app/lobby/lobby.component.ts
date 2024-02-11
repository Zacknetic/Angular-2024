import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-lobby',
	standalone: true,
	imports: [NgFor],
	templateUrl: './lobby.component.html',
	styleUrl: './lobby.component.css',
})
export class LobbyComponent implements OnInit {
  rooms: { [key: string]: string[] } = {};

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms(): void {
    setTimeout(() => {
      this.rooms = {
        room1: ['usera', 'userb'],
        room2: ['userc'],
      };
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 1000);
  }

  enterRoom(roomId: string): void {
    this.router.navigate(['/room', roomId]);
  }

  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
}