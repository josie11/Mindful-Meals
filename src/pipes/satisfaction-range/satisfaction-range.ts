import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SatisfactionRangePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'satisfactionRange',
})
export class SatisfactionRangePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    const rangeValues = {
      1: 'Very Unsatisfied',
      2: 'Unsatisfied',
      3: 'Satisfied',
      4: 'Very Satisfied'
    };

    return rangeValues[value];
  }
}
