import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {DatePipe, NgFor} from "@angular/common";
import {MatCardSubtitle} from "@angular/material/card";

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    DatePipe,
    NgFor,
    MatCardSubtitle
  ],
  templateUrl: './event-dialog.component.html',
})
export class EventDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
