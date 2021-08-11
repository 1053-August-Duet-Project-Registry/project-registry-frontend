import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Item, Period, Section, Events } from 'ngx-time-scheduler';
import { map } from 'rxjs/operators';
import { BatchTemplate } from 'src/app/models/batch.model';
import { LoginServiceService } from 'src/app/service/login-service.service';
import { IterationService } from 'src/app/service/iteration.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit, AfterViewInit {
  events: Events = new Events();
  periods: Period[] = [];
  sections: Section[] = [];
  items: Item[] = [];
  numOfDays = 0;

  timelineLowerBound = moment().subtract(7, 'days').startOf('day');
  timelineUpperBound = moment();
  topLeftHeaderName = 'Batch';
  @ViewChildren('ngxTs', { read: ElementRef }) ngxTs!: QueryList<ElementRef>;

  constructor(public iter: IterationService, private datePipe: DatePipe,
              private loginService: LoginServiceService, private route: Router) {}

  ngAfterViewInit(): void {
    /**
     * ngx-time-scheduler css hack heavy lifting.
     * Code below is to make sure the timeline table is ready to be
     * querySelected.
     */
    this.ngxTs.changes.subscribe((next: QueryList<ElementRef>) => {
      const ngxTs = next.first.nativeElement;
      const colWidthCoefficient = 90;
      ngxTs.querySelector('.time-sch-table-wrapper').style.width = `${
        200 + colWidthCoefficient * this.numOfDays
      }px`;
      const topLeftHeader: HTMLElement = ngxTs.querySelector(
        '.time-sch-section'
      );
      topLeftHeader.innerHTML = this.topLeftHeaderName;
      topLeftHeader.setAttribute('rowspan', '2');
      const timeScheduleTable: HTMLElement = ngxTs.querySelector(
        '.time-sch-table'
      );
      const colHeaders = timeScheduleTable.querySelectorAll(
        'tr:nth-of-type(2) > td'
      );
      const weekDayMapper: Record<string, string> = {
        Mon: 'Monday',
        Tue: 'Tuesday',
        Wed: 'Wednesday',
        Thu: 'Thursday',
        Fri: 'Friday',
        Sat: 'Saturday',
        Sun: 'Sunday',
      };
      colHeaders.forEach((elm) => {
        const res = /(\d+)\(([A-z]+)\)/.exec(elm.innerHTML) as Array<string>;
        elm.innerHTML = `
      <div style="display: flex; flex-direction: column;">
        <span style="font-size:16px">${res[1]}</span>
        <span style="font-size:13px">${weekDayMapper[res[2]]}</span>
      </div>`;
      });
    });
  }

  async ngOnInit(): Promise<any> {
  // Check if user is logged in, otherwise redirect.
    if (! this.loginService.checkSessionLogin()) {
      this.route.navigate(['/homepage-login']);
    }

    const batch: BatchTemplate[] = await this.iter
      .getBatchService()
      .pipe(
        map((batch) =>
          [...batch]
            .sort(
              (a, b) =>
                new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            )
            .filter(
              (batch) =>
                new Date(batch.endDate).getTime() -
                  this.timelineLowerBound.toDate().getTime() >
                0
            )
        )
      )
      .toPromise();

    this.timelineUpperBound = moment(batch[batch.length - 1].endDate).add(
      1,
      'day'
    );
    /**
     * Iterate over the batch data and populate the Timeline table by putting
     * together batch details into format the Library(ngx-time-scheduler) likes.
     */
    for (let i = 0; i < batch.length; i++) {
      this.sections.push({
        id: i + 1,
        name:
        this.datePipe.transform(batch[i].startDate, 'mediumDate') +
        ' - ' +
        this.datePipe.transform(batch[i].endDate, 'mediumDate'),
      });
      this.items.push({
        id: i + 1,
        sectionID: i + 1,
        name: `${batch[i].batchId} : ${batch[i].skill} @ ${batch[i].location}`,
        // Please be aware of the timezone differences. All dates in yyyy-MM-dd
        // coming from the server are assumed to be `UTC`
        start: moment.utc(batch[i].startDate),
        end: moment.utc(batch[i].endDate),
        classes: `class${i}`,
      });

    }

    /**
     * Creating a div to hold information from clicking items in chart and appending it to Batch Information div, also added events to HTML
     */
    const myDiv = document.createElement('div');
    const parentDiv = document.querySelector('.displayInfo');
    this.events.ItemClicked = (items) => {
      myDiv.innerHTML =
        items.classes +
        ' <br />SectionId: ' +
        items.sectionID +
        ' <br />Name: ' +
        items.name +
        ' <br />StartDate: ' +
        items.start.toDate().toUTCString() +
        ' <br />EndDate: ' +
        items.end.toDate().toUTCString();
      parentDiv?.appendChild(myDiv);
    };

    /**
     * Find out how 'wide' the table should be by 'diffing' the upper and lower
     * limit.
     */
    this.numOfDays =
      this.timelineUpperBound.diff(this.timelineLowerBound, 'days') + 1;

    /**
     * Should never touch this array
     */
    this.periods = [
      {
        name: '',
        classes: '',
        timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
        timeFramePeriod: 1440,
        timeFrameOverall: 1440 * this.numOfDays,
      },
    ];
  }
}
