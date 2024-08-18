import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { MatListItem, MatNavList } from "@angular/material/list";
import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { EventDialogComponent } from "../event-dialog/event-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import esLocale from '@fullcalendar/core/locales/es';
import { CreateEditDialogComponent } from "../create-edit-dialog/create-edit-dialog.component";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MatPaginator } from "@angular/material/paginator";
import { EventService } from "../../services/event.service";
import { EventModel } from "../../shared/models/event-model";
import {ReformatUtils} from "../../shared/Utils/reformat.utils";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatSidenavContainer,
    MatToolbar,
    MatNavList,
    FullCalendarModule,
    MatListItem,
    MatSidenav,
    MatSidenavContent,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatSuffix,
    OwlDateTimeModule,
    MatPaginator
  ],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent | undefined;
  calendarOptions: any;
  dateControl: FormControl = new FormControl(new Date());
  displayedColumns: string[] = ['title', 'zone', 'date', 'initHour', 'endHour', 'actions'];
  filteredEvents = new MatTableDataSource<any>();
  selectedMonth: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  allEvents: EventModel[] = [];

  constructor(private dialog: MatDialog,
              private eventService: EventService,
              private cdr: ChangeDetectorRef,
              private reformatUtils: ReformatUtils) {
    this.eventService.getEvents().subscribe((resp: any) => {
      for (let event of resp) {
        const initDate = this.reformatUtils.reformatDate(event.start_date);
        const endDate = this.reformatUtils.reformatDate(event.end_date);
        this.allEvents.push({
          title: event.sport.name,
          zone: event.sport.zone,
          description: event.description,
          date: initDate.date,
          initHour: initDate.time,
          endHour: endDate.time,
          identifier: event.id
        });
      }
      this.updateCalendarEvents();
      this.filterEventsByMonth(new Date());
    });

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      editable: true,
      locales: [esLocale],
      locale: 'es',
      selectable: true,
      events: this.allEvents,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };

    this.dateControl.valueChanges.subscribe((date: Date) => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().gotoDate(date);
        this.filterEventsByMonth(date);
      }
      this.cdr.detectChanges();
    });

    this.filteredEvents.filterPredicate = (data: any, filter: string): boolean => {
      return data.sport.toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.filteredEvents.paginator = this.paginator;
  }

  handleDateClick(arg: any) {
    const clickedDate = new Date(arg.dateStr);
    const events = this.allEvents.filter(event => {
      const eventStart = new Date(event.date);
      return eventStart.toDateString() === clickedDate.toDateString();
    });

    if (events.length > 0) {
      this.dialog.open(EventDialogComponent, {
        data: { events: events, date: arg.dateStr }
      });
    }
  }

  handleEventClick(arg: any) {
    const clickedDate = new Date(arg.event.startStr);
    this.handleDateClick({ dateStr: clickedDate.toISOString().split('T')[0] });
  }

  filterEventsByMonth(date: Date) {
    const startMonth = startOfMonth(date);
    const endMonth = endOfMonth(date);

    this.filteredEvents.data = this.allEvents.filter(event => {
      const eventStart = parseISO(event.date);
      return isWithinInterval(eventStart, { start: startMonth, end: endMonth });
    });

    this.selectedMonth = startMonth;
  }

  applyTitleFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredEvents.filter = filterValue.trim().toLowerCase();

    if (this.filteredEvents.paginator) {
      this.filteredEvents.paginator.firstPage();
    }
  }

  deleteEvent(event: any) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Evento',
        action: this.eventService.deleteEvent(event.identifier),
        confirmAction: 'Eliminar',
        cancelAction: 'Cancelar',
        isWarnBotton: true,
        message: '¿Estás seguro de que deseas eliminar el evento?',
        notificationSuccess: 'Evento eliminado exitosamente',
      },
    }).afterClosed().subscribe(result => {
      if (result.detail) {
        alert('Error al eliminar el evento: ' + result.details);
      }
      this.refreshEvents();
    });
  }

  editEvent(event: any) {
    this.dialog.open(CreateEditDialogComponent, {
      width: '500px',
      data: {
        isEdit: true,
        event: event
      },
    }).afterClosed().subscribe(_ => {
      this.refreshEvents();
    });
  }

  createEvent() {
    this.dialog.open(CreateEditDialogComponent, {
      width: '500px',
      data: {
        isEdit: false
      },
    }).afterClosed().subscribe(_ => {
      this.refreshEvents();
    });
  }

  refreshEvents() {
    this.eventService.getEvents().subscribe((resp: any) => {
      this.allEvents = [];
      for (let event of resp) {
        const initDate = this.reformatUtils.reformatDate(event.start_date);
        const endDate = this.reformatUtils.reformatDate(event.end_date);
        this.allEvents.push({
          title: event.sport.name,
          zone: event.sport.zone,
          description: event.description,
          date: initDate.date,
          initHour: initDate.time,
          endHour: endDate.time,
          identifier: event.id
        });
      }
      this.updateCalendarEvents();
      this.filterEventsByMonth(this.selectedMonth);
    });
  }

  updateCalendarEvents() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().removeAllEvents();
      this.calendarComponent.getApi().addEventSource(this.allEvents);
    }
  }
}
