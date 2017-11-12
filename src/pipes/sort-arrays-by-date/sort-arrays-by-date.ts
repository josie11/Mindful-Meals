import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortArraysByDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortArraysByDate',
})
export class SortArraysByDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<any>, datePropName: string) {
    return value.sort((a: object[], b: object[]) => {
      const aDate = new Date(a[0][datePropName]);
      const bDate = new Date(b[0][datePropName]);
      return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
    });
  }
}
