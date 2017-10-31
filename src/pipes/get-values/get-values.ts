import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the GetValuesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'getValues',
})
export class GetValuesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: object, ...args) {
    //can't use Object.values();
    const properties = [];
    for (let key in value) {
      properties.push(value[key]);
    }
    return properties;
  }
}
