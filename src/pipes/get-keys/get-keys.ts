import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the GetKeysPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'getKeys',
})
export class GetKeysPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: object, ...args) {
    return Object.keys(value);
  }
}
