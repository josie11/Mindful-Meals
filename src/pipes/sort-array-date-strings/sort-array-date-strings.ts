import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortArrayDateStringsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortArrayDateStrings',
})
export class SortArrayDateStringsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<string>, descending: boolean = false) {
    const sorted = value.sort((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);
      return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
    });
    return descending ? sorted.reverse() : sorted;
  }
}
