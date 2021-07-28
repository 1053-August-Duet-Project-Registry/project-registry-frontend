import { IterationService } from 'src/app/service/iteration.service';
import { map } from 'rxjs/operators';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import GSTC, { Config, GSTCResult } from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js';
import { DatePipe } from '@angular/common';
import { BatchTemplate } from 'src/app/models/batch.model';
import { mockData } from './timelineMockData';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [
  './timeline.component.css',
  '../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css'],
  encapsulation: ViewEncapsulation.None,
})

export class TimelineComponent implements OnInit {

  constructor(public iter: IterationService, private datePipe: DatePipe) { }
  /* START OF TIMELINE CONFIG */

  @ViewChild('gstcElement', { static: true }) gstcElement!: ElementRef;
  gstc!: GSTCResult;

  currentDate = new Date();
  timelineUpperBound: Date = this.currentDate;
  timelineLowerBound: Date = this.currentDate;

  batchArray?: Array<BatchTemplate>;

  generateConfig(batch: Array<BatchTemplate>): Config {
    const iterations = batch.length;
    // GENERATE SOME ROWS

    const rows = {};
    for (let i = 0; i < iterations; i++) {

      const id = GSTC.api.GSTCID(i.toString());
      // @ts-ignore
      rows[id] = {
        id,
        label: this.datePipe.transform(batch[i].startDate, 'mediumDate')
        + ' - ' + this.datePipe.transform(batch[i].endDate, 'mediumDate'),

        parentId: undefined,
        expanded: true,
      };
    }

    // GENERATE SOME ROW -> ITEMS

    let start = GSTC.api.date().startOf('day').subtract(2, 'day');
    const items = {};
    for (let i = 0; i < iterations; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      start = start.add(0, 'day');
      // @ts-ignore
      items[id] = {
        id,
        label: batch[i].batchId + ' : ' + batch[i].skill + ' @ ' + batch[i].location,
        time: {
          start: GSTC.api.date(batch[i].endDate).startOf('day').subtract(21, 'day'),
          end: GSTC.api.date(batch[i].endDate).endOf('day'),
        },
        rowId: id,
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        [GSTC.api.GSTCID('label')]: {
          id: GSTC.api.GSTCID('label'),
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Batch',
          },
        },
      },
    };

    return {
      innerHeight: 420,
      licenseKey:
        '====BEGIN LICENSE KEY====\nfVZYaLOuQUCwIHSxRwRdtSjNw3AW38hz28xN3U3XhJgRgJK1y+TyM6VodjaSsvuMMfP4YOiqEBuhL0SuM5PTLRdYI459kSM7N1X93M5QLxghxzER975gud3URquky8MiStbIvFAcF1/vjmY0qt6rGKpc2fGNl+3hWRT0+lAKHdMmtY4XpXf6WvycmssiiXlW0vGWk3AWDiUDAHxE1OrmI1a2BrxX6zOALRQqeNcxWjf9Jj9RZkxPTMqPPMRdqTU7Qhzq3PWzmIWCgpOz5ggITsCi2hQQCjz+FzeKkUWBG0Kh6fcaP/tunhpWxT+UtRYAvtunH3YXKMVpn6tf4Bf3rQ==||U2FsdGVkX1+1WAv9e4U7OPZLTQtjJ+8HtC9NHPo144Ap9u1bpPMeUnp4CIq4GXERbjGG276Se7f9qPduT3S6zIWxMI1NRXsb16ZHOtibmKY=\nTD66OA9qd67s12GL91M9IlFqtjcAgS/xaHIBia6bjI9JOEWwrf8xdOLbUo07n4apCxj8jf+AroOJmOjwDa2p5NJDer4TRgO4SDam8TV7rIWdV1KbAmKKA8OjfulSDH9a5G1MD55DTeAdx5n48lnz220y1rKs9th5ECFOJoiLjlh12LxvuvpLwN7g9hOsuaKgbIVkbpa1UEdwdEpgZOd4zCpn3g4gKOJm6KIrZUWPpI0fh0dZG+nbqX/FBtLFeQF42zaXeBw0lvy2xiq1QGCRKt/U1bhIu1Mi33ZIFIO+qZLQ4x6ECFEb/8AjRP27GqmfwIIfTYjuGJL9cad58+L61A==\n====END LICENSE KEY====',
      list: {
        rows,
        columns,
        toggle: {
          display: false
        }
      },
      chart: {
        items,
        time: {
          from: GSTC.api.date().startOf('day').subtract(7, 'day').valueOf(),
          leftGlobal: 0, // default value, don't know what it does but config requires it
          to: GSTC.api.date(this.timelineUpperBound).valueOf(),
        },
      },
      plugins: [TimelinePointer(), Selection()],
    };
  }

  /* END OF TIMELINE CONFIG */

  ngOnInit(): void {
    this.timelineLowerBound = new Date();
    this.timelineLowerBound.setDate(this.timelineUpperBound.getDate() - 7);
    this.iter.getBatchServiceMock().pipe(
      map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()))
    );

    const batch = mockData;

    this.batchArray = batch.sort((a, b) =>
      new Date(a.endDate).getTime() - new Date(b.endDate).getTime()).filter(batch =>
      new Date(batch.endDate).getTime() - this.timelineLowerBound.getTime() > 0);
    this.calculateUpperBound(this.batchArray);
    console.log(this.batchArray);

    // vp,,rmy
    this.gstc = GSTC({
          element: this.gstcElement.nativeElement,
          state: GSTC.api.stateFromConfig(this.generateConfig(this.batchArray))
    });
  }

  calculateUpperBound(batchArray: Array<BatchTemplate>) {
    this.timelineUpperBound = new Date(batchArray[batchArray.length - 1].endDate);
    this.timelineUpperBound.setDate(this.timelineUpperBound.getDate() + 1);
    console.log(this.timelineUpperBound);
  }
}
