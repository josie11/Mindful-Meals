import { NgModule } from '@angular/core';
import { CravingsRangePipe } from './cravings-range/cravings-range';
import { HungerRangePipe } from './hunger-range/hunger-range';
import { SortByPipe } from './sort-by/sort-by';
import { GetKeysPipe } from './get-keys/get-keys';
import { GetValuesPipe } from './get-values/get-values';
import { SortStringsPipe } from './sort-strings/sort-strings';
import { SatisfactionRangePipe } from './satisfaction-range/satisfaction-range';
import { SortArrayDateStringsPipe } from './sort-array-date-strings/sort-array-date-strings';
import { SortArrayEntriesByTimePipe } from './sort-array-entries-by-time/sort-array-entries-by-time';
import { SortArraysByDatePipe } from './sort-arrays-by-date/sort-arrays-by-date';
@NgModule({
	declarations: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe,
    SortArrayDateStringsPipe,
    SortArrayEntriesByTimePipe,
    SortArraysByDatePipe],
	imports: [],
	exports: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe,
    SortArrayDateStringsPipe,
    SortArrayEntriesByTimePipe,
    SortArraysByDatePipe]
})
export class PipesModule {}
