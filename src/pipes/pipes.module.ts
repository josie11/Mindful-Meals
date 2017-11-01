import { NgModule } from '@angular/core';
import { CravingsRangePipe } from './cravings-range/cravings-range';
import { HungerRangePipe } from './hunger-range/hunger-range';
import { SortByPipe } from './sort-by/sort-by';
import { GetKeysPipe } from './get-keys/get-keys';
import { GetValuesPipe } from './get-values/get-values';
import { SortStringsPipe } from './sort-strings/sort-strings';
import { SatisfactionRangePipe } from './satisfaction-range/satisfaction-range';
@NgModule({
	declarations: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe],
	imports: [],
	exports: [CravingsRangePipe,
    HungerRangePipe,
    SortByPipe,
    GetKeysPipe,
    GetValuesPipe,
    SortStringsPipe,
    SatisfactionRangePipe]
})
export class PipesModule {}
