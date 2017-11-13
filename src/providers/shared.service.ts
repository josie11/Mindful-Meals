import { Injectable } from '@angular/core';
import difference from 'lodash.difference';
/*
  Generated class for the SharedService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedService {

  constructor() {
  }

  /**
   * will compare two arrays of ids, and find which ids should be added/deleted
   * based on what ids are in arrays.
   * @param {beforeIds} array of item ids associated with meal.
   *
   * @param {afterIds} array of item ids to be associated with meal.
   *
   * @return {object} returns object with array on add property and delete property --> { add: [], delete: [] }
  */
  findChangesToItems(beforeIds: Array<number>, afterIds: Array<number>) {
    const deleteIds = difference(beforeIds, afterIds);
    const addIds = difference(afterIds, beforeIds);

    return { addIds, deleteIds };
  }

  /**
   * Formats array of associated items to an object where keys are ids and value are item name.
   * For use in components like checkbox list and forms.
   * @param {items} array of meal/craving item objects.
   *
   * @return {object} returns formatted object --> { itemId: itemName, ... }
  */
  formatItemsArrayToObject(items: Array<object>) {
    return items.reduce((obj, item: any) => {
      obj[item.id] = item.name;
      return obj;
    }, {});
  }

}
