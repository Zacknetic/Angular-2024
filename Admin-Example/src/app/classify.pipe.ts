import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classify',
  standalone: true
})
export class ClassifyPipe implements PipeTransform {
  private lookup: Array<string> = new Array(1000);
  // Pre-compute the lookup table. This is a simple example, but in a real-world scenario, you would likely compute it on the server and fetch it from there.
  constructor() {
    for (let i = 0; i < 333; i++) {
      this.lookup[i] = 'Class A';
    }
    for (let i = 333; i < 666; i++) {
      this.lookup[i] = 'Class B';
    }
    for (let i = 666; i < 1000; i++) {
      this.lookup[i] = 'Class C';
    }
  }

  transform(value: string): string {
    const val = parseInt(value);
    return this.lookup[val] + ' ' + value;
  }

}
