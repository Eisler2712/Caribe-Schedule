import { Routes } from '@angular/router';
import {CalendarComponent} from "./calendar/calendar.component";
import {SportsConfigComponent} from "./sports-config/sports-config.component";

export const PagesRoutes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {
    path: 'sports-config',
    component: SportsConfigComponent
  }
];
