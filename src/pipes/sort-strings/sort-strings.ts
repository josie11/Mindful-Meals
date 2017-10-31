import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortStringsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortStrings',
})
export class SortStringsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {
    return value.sort((a, b) => {
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      return 0;
    });
  }
}
