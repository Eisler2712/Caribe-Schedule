import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {Sport} from "../../shared/models/sport-model";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {SportService} from "../../services/sport.service";

@Component({
  selector: 'app-sports-config-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FormsModule,
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatIcon,
    NgForOf,
    NgIf,
    MatIconButton,
    MatToolbar,
    UpperCasePipe,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './sports-config-dialog.component.html',
  styleUrl: './sports-config-dialog.component.css'
})
export class SportsConfigDialogComponent implements OnInit{
  selectedIncompatibleSport: string = '';
  incompatibleSports: string[] = [];
  allSports: Sport[] = [];
  isEdit: boolean = false;
  form: FormGroup;
  required = 'Este campo es requerido';
  sportEdit: any;

  constructor(
    public dialogRef: MatDialogRef<SportsConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sportService: SportService
  ) {
    this.isEdit = !!data.isEdit;
    this.sportEdit = data.sport ? data.sport : null;
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      zone: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
        this.sportService.getSports().subscribe((resp: any) => {
            this.allSports = resp;
        });
        if (this.isEdit) {
            this.sportService.getSport(this.data.sport.id).subscribe((resp: any) => {
                this.form.get('name')?.setValue(resp.name);
                this.form.get('zone')?.setValue(resp.zone);
                this.incompatibleSports = resp.incompatible_sports;
            });
        }
    }

  addIncompatibleSport() {
    if (this.selectedIncompatibleSport && !this.incompatibleSports.includes(this.selectedIncompatibleSport)) {
      this.incompatibleSports.push(this.selectedIncompatibleSport);
    }
  }

  removeIncompatibleSport(incompatible: string) {
    this.incompatibleSports = this.incompatibleSports.filter(sport => sport !== incompatible);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      const body = {
        name: this.form.get('name')?.value,
        zone: this.form.get('zone')?.value,
        incompatible_sports: this.incompatibleSports
      };
      if (this.isEdit) {
        this.sportService.updateSport(body,this.sportEdit.id).subscribe((resp: any) => {
          this.dialogRef.close(resp);
        });
      } else {
        this.sportService.createSport(body).subscribe((resp: any) => {
          this.dialogRef.close(resp);
        });
      }
    }
  }

  updateSelectedSport(name: string) {
    this.selectedIncompatibleSport = name;
  }
}
