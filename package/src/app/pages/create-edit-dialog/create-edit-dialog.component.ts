import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {MatToolbar} from "@angular/material/toolbar";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatListItemIcon} from "@angular/material/list";
import {MatLabel} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {OwlDateTimeModule} from "@danielmoncada/angular-datetime-picker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {EventService} from "../../services/event.service";
import {ReformatUtils} from "../../shared/Utils/reformat.utils";
import {MatIcon} from "@angular/material/icon";
import {Sport} from "../../shared/models/sport-model";
import {SportService} from "../../services/sport.service";

@Component({
  selector: 'app-user-management-dialog',
  templateUrl: './create-edit-dialog.component.html',
  styleUrls: ['./create-edit-dialog.component.css'],
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogContent,
    ReactiveFormsModule,
    NgIf,
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatDialogActions,
    NgClass,
    MatSelect,
    MatOption,
    NgForOf,
    TablerIconsModule,
    MatListItemIcon,
    MatLabel,
    MatError,
    MatCheckbox,
    MatRadioGroup,
    MatRadioButton,
    OwlDateTimeModule,
    NgxMaterialTimepickerModule,
    MatIcon,
    MatIconButton
  ],
  encapsulation: ViewEncapsulation.None
})
export class CreateEditDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isEdit: boolean;
  title: string;
  actionText: string;
  form: FormGroup;
  checkMale: boolean = true;
  required = 'Este campo es requerido';
  allSports: Sport[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private sportService: SportService,
    private reformatUtils: ReformatUtils
  ) {
    this.isEdit = data.isEdit;
    this.title = this.isEdit ? 'Editar Evento' : 'Crear Evento';
    this.actionText = this.isEdit ? 'Editar' : 'Crear';
    this.form = this.fb.group(
      {
        sport: [null, [Validators.required, Validators.minLength(1)]],
        gender: ["M", [Validators.required]],
        date: [null, [Validators.required]],
        initHour: [null, [Validators.required]],
        endHour: [null, [Validators.required]],
      },
    );
  }

  ngOnInit() {
    this.sportService.getSports().subscribe((resp: any) => {
      this.allSports = resp;
    });
    if(this.isEdit) {
      this.eventService.getEvent(this.data.event.identifier).subscribe((resp: any) => {
        this.form.get('sport')?.setValue(resp.sport.name);
        this.form.get('gender')?.setValue(resp.gender);
        if(resp.gender === 'F') this.checkMale = false;
        const initDate = this.reformatUtils.reformatDate(resp.start_date);
        const endDate = this.reformatUtils.reformatDate(resp.end_date);
        const adjustedInitDate = this.parseDateToLocal(initDate.date);
        this.form.get('date')?.setValue(adjustedInitDate);
        this.form.get('initHour')?.setValue(initDate.time);
        this.form.get('endHour')?.setValue(endDate.time);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  disableForm() {
    this.form.disable();
  }

  enableForm() {
    this.form.enable();
  }

  submit() {
    this.disableForm();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const req = {
      "sport": this.form?.value?.sport,
      "description": " ",
      "start_date": this.combineDateAndTime(this.form.value.date, this.form.value.initHour),
      "end_date": this.combineDateAndTime(this.form.value.date, this.form.value.endHour),
      "gender": this.form?.value?.gender,
    };
    if (this.isEdit) {
      this.eventService.updateEvent(req, this.data.event.identifier).subscribe((resp: any) => {
        if(resp){
          this.dialogRef.close(resp);
        }else{
          alert('Error al actualizar el evento');
          this.enableForm();
        }
      });
    } else {
      this.eventService.createEvent(req).subscribe((resp: any) => {
        if(resp){
          this.dialogRef.close(resp);
        }else{
          alert('Error al crear el evento');
          this.enableForm();
        }
      });
    }
  }

  private combineDateAndTime(date: Date, time: string): string {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    else if (modifier === "AM" && hours === 12) hours = 0;

    const newDate = new Date(date);

    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return this.formatDateToCustomStringLocal(newDate);
  }

  private formatDateToCustomStringLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0') + '000';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  private parseDateToLocal(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

}
