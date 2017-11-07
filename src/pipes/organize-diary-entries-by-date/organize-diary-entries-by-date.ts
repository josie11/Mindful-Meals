import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ArrayToObjectPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'organizeDiaryEntriesByDate',
})
export class OrganizeDiaryEntriesByDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<object>, property) {
    return value.reduce((obj: any , item) => {
      obj[property] = obj[property] || [];
      obj[property].push(item);
      return obj;
    }, {})
  }
}
