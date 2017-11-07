import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortArrayEntriesByTimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortArrayEntriesByTime',
})
export class SortArrayEntriesByTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<object>, timePropName: string) {
    return value.sort((a, b) => {
      const aDate = new Date(`2017-01-01T${a[timePropName]}`);
      const bDate = new Date(`2017-01-01T${b[timePropName]}`);
      return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
    });
  }
}
