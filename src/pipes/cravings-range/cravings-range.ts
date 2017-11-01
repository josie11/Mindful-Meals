import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CravingsRangePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cravingsRange',
})
export class CravingsRangePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string | number, ...args) {
    const rangeValues = {
      1: 'Mild',
      2: 'Moderate',
      3: 'Severe',
      4: 'Extreme'
    }

    return rangeValues[value];
  }
}
