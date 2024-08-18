import {Component, OnInit} from '@angular/core';
import {Sport} from "../../shared/models/sport-model";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgFor, NgForOf, NgIf} from "@angular/common";
import {SportsConfigDialogComponent} from "../sports-config-dialog/sports-config-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatLine} from "@angular/material/core";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {SportService} from "../../services/sport.service";

@Component({
  selector: 'app-sports-config',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    MatIcon,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    MatInput,
    MatIconButton,
    MatButton,
    MatLabel,
    NgForOf,
    NgFor,
    NgIf,
    MatLine
  ],
  templateUrl: './sports-config.component.html',
  styleUrl: './sports-config.component.css'
})
export class SportsConfigComponent implements OnInit{
  sportsList: any = [];
  selectedSport: any = null;

  constructor(private dialog: MatDialog,
              private sportService: SportService) {}

  ngOnInit(): void {
        this.getAllSports();
    }

  editSport(sport: any) {
    this.dialog.open(SportsConfigDialogComponent, {
      data: { sport: sport, isEdit: true},
    }).afterClosed().subscribe(result => {
      if (result){
        this.refreshSportsList();
        alert('Deporte editado exitosamente');
      }
      this.selectedSport = null;
    });
  }
  private getAllSports() {
    this.sportService.getSports().subscribe((resp: any) => {
      if(resp){
        this.sportsList = resp.sort((a: Sport, b: Sport) => a.name.localeCompare(b.name));
      }
    });
  }

  private refreshSportsList() {
    this.getAllSports();
  }

  createSport() {
    this.dialog.open(SportsConfigDialogComponent, {
      data: { isEdit: false},
    }).afterClosed().subscribe(result => {
      if (result) {
        this.refreshSportsList();
        alert('Deporte creado exitosamente');
      }
    });
  }

  deleteSport(sport: any) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Deporte',
        action: this.sportService.deleteSport(sport.id),
        confirmAction: 'Eliminar',
        cancelAction: 'Cancelar',
        isWarnBotton: true,
        message: '¿Estás seguro de que deseas eliminar el deporte?',
        notificationSuccess: 'Deporte eliminado exitosamente',
      },
    }).afterClosed().subscribe(result => {
      if (result){
        this.refreshSportsList();
      }
    });
  }
}
