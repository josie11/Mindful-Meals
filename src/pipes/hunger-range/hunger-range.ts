import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HungerRangePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'hungerRange',
})
export class HungerRangePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string | number, ...args) {
    const hungerLevels = {
      1: 'Starving',
      2: 'Hungry',
      3: 'Comfortable',
      4: 'Full',
      5: 'Stuffed'
    };

    return hungerLevels[value];
  }
}
