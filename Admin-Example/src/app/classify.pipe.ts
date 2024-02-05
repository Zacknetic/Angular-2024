import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classify',
  standalone: true
})
export class ClassifyPipe implements PipeTransform {
  private max = 1000;
  private lookup: Array<string> = new Array(this.max);

  // Pre-compute the lookup table. This is a simple example, but in a real-world scenario, you would likely compute it on the server and fetch it from there.
  constructor() {
    for (let i = 1900; i < 1928; i++) {
      this.lookup[i] = 'Greatest Generation';
    }
    for (let i = 1928; i < 1946; i++) {
      this.lookup[i] = 'Silent Generation';
    }
    for (let i = 1946; i < 1965; i++) {
      this.lookup[i] = 'Baby Boomer';
    }
    for (let i = 1965; i < 1981; i++) {
      this.lookup[i] = 'Generation X';
    }
    for (let i = 1981; i < 1997; i++) {
      this.lookup[i] = 'Millennials';
    }
    for (let i = 1997; i < 2013; i++) {
      this.lookup[i] = 'Generation Z';
    }
    for (let i = 2013; i < 2025; i++) {
      this.lookup[i] = 'Generation Alpha';
    }


  }

  transform(value: string): string {
    const val = parseInt(value);
    let lookup = this.lookup[val];
    if(!lookup) lookup = 'Class D';
    return lookup + ' ' + value;
  }

}
