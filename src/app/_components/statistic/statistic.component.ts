import { Component, OnInit, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { Statistic, ExamResult, Exam } from '../../_models';
import { ExamResultService } from '../../_services';

@Component({
    templateUrl: './statistic.component.html',
    selector: 'app-statistic',
    styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
    stat: Statistic;
    examId = -1;
    examResults: ExamResult[];
    exams: Exam[] = [];
    optionScores: any;
    optionRate: any;

    constructor(private examResultService: ExamResultService) {

    }

    ngOnInit() {
        this.refresh();
    }

    private refresh() {
        this.refreshStat();

        this.examResultService.getAll().pipe(first()).subscribe(result => {
            if (result) {
                this.examResults = result;
            } else {
                this.examResults = [];
            }

            this.examResults.forEach(examResult => {
                let found = false;
                this.exams.forEach(exam => {
                    if (exam.id === examResult.exam.id) {
                        found = true;
                        return;
                    }
                });

                if (!found) {
                    this.exams.push(examResult.exam);
                }
            });
        });
    }

    refreshStat(): any {
        if (this.examId !== -1) {
            this.examResultService.getStat(this.examId).pipe(first()).subscribe(stat => {
                this.stat = stat;

                this.optionScores = {
                    title: {
                        text: '成绩分布统计',
                        subtext: '按区间统计',
                        x: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.stat.scoreCount,
                        type: 'bar'
                    }]
                };

                this.optionRate = {
                    title: {
                        text: '成绩分布统计',
                        subtext: '按比例统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a}%'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: ['通过率', '优秀率', '其他']
                    },
                    series: [
                        {
                            name: '比例',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: [{
                                name: '通过率',
                                value: this.stat.passRate - this.stat.excellentRate,
                            },
                            {
                                name: '优秀率',
                                value: this.stat.excellentRate
                            }
                                , {
                                name: '其他',
                                value: 100 - this.stat.passRate
                            }],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            });
        }

        return this.optionScores;
    }
}
