import {
    Directive, ElementRef, Input, OnInit, HostBinding, OnChanges, OnDestroy
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;


@Directive({
    selector: '[appEChart]',
})
export class EchartsDirective implements OnChanges, OnInit, OnDestroy {
    private chart: ECharts;
    private sizeCheckInterval = null;
    private reSize$ = new Subject<string>();
    private onResize: Subscription;

    @Input() chartOptions: EChartOption;

    @HostBinding('style.height.px')
    elHeight: number;

    constructor(private el: ElementRef) {
        this.chart = echarts.init(this.el.nativeElement, 'vintage');
    }


    ngOnChanges(changes) {
        if (this.chartOptions) {
            this.chart.setOption(this.chartOptions);
        }
    }

    ngOnInit() {
        this.sizeCheckInterval = setInterval(() => {
            this.reSize$.next(`${this.el.nativeElement.offsetWidth}:${this.el.nativeElement.offsetHeight}`);
        }, 100);
        this.onResize = this.reSize$
            .subscribe((_) => this.chart.resize());

        this.elHeight = this.el.nativeElement.offsetHeight;
        if (this.elHeight < 300) {
            this.elHeight = 300;
        }
    }


    ngOnDestroy() {
        if (this.sizeCheckInterval) {
            clearInterval(this.sizeCheckInterval);
        }
        this.reSize$.complete();
        if (this.onResize) {
            this.onResize.unsubscribe();
        }
    }
}
