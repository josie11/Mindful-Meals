import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortByPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  /**
   * Takes an array of objects and sorts
   */
  transform(value: Array<object>, property: string) {
    return value.sort((a, b) => {
      if (typeof a[property] === 'number' && typeof b[property] ==='number') return a[property] - b[property];
      const [itemA, itemB] = [a[property].toLowerCase(), b[property].toLowerCase()]
      return itemA > itemB ? 1 : itemA < itemB  ? -1 : 0;
    });
  }
}
