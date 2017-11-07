import { NgModule } from '@angular/core';
import { CravingsRangePipe } from './cravings-range/cravings-range';
import { HungerRangePipe } from './hunger-range/hunger-range';
import { SortByPipe } from './sort-by/sort-by';
import { GetKeysPipe } from './get-keys/get-keys';
import { GetValuesPipe } from './get-values/get-values';
import { SortStringsPipe } from './sort-strings/sort-strings';
import { SatisfactionRangePipe } from './satisfaction-range/satisfaction-range';
import { OrganizeDiaryEntriesByDatePipe } from './organize-diary-entries-by-date/organize-diary-entries-by-date';
import { SortArrayDateStringsPipe } from './sort-array-date-strings/sort-array-date-strings';
import { SortArrayEntriesByTimePipe } from './sort-array-entries-by-time/sort-array-entries-by-time';
@NgModule({
	declarations: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe,
    OrganizeDiaryEntriesByDatePipe,
    SortArrayDateStringsPipe,
    SortArrayEntriesByTimePipe],
	imports: [],
	exports: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe,
    OrganizeDiaryEntriesByDatePipe,
    SortArrayDateStringsPipe,
    SortArrayEntriesByTimePipe]
})
export class PipesModule {}
