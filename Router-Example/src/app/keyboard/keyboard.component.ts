import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css'
})
export class KeyboardComponent {
  // Define the keys for the keyboard
  rows: string[][] = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '-', '_'],
    ['space']
  ];

  // Variable to hold the input from the keyboard
  inputText: string = '';

  // Method to handle key presses
  onKeyPress(key: string) {
    if (key === 'space') {
      this.inputText += ' ';
    } else {
      this.inputText += key;
    }
  }

  // Method to clear the input
  clearInput() {
    this.inputText = '';
  }
}