import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatListItemIcon} from "@angular/material/list";

@Component({
  selector: "app-confirm-dialog-component",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
  imports: [
    UpperCasePipe,
    MatToolbar,
    MatDialogContent,
    NgClass,
    MatDialogActions,
    MatButton,
    TablerIconsModule,
    NgIf,
    MatDialogClose,
    MatDialogTitle,
    MatListItemIcon
  ],
  standalone: true
})
export class ConfirmDialogComponent implements OnInit {
    isLoading: boolean = false;
    title: string;
    action: any;
    message: string;
    messageBlack: boolean;
    subMessage: string;
    confirmAction: string;
    cancelAction: string;
    notificationSuccess: string;
    isWarnBotton: boolean;
    multipleAction = false;
    textCenterTitle = false;
    notificationFailMultiple: string;

    controlForm!: FormGroup;
    faSpinner = faSpinner;
    isDownloadFile: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
    ) {
        this.title = data.title;
        this.action = data.action;
        this.isDownloadFile = data.isDownloadFile
        this.multipleAction = data.multipleAction;
        this.message = data.message ? data.message : "";
        this.messageBlack = data.messageBlack;
        this.textCenterTitle = data.textCenterTitle;
        this.subMessage = data.subMessage ? data.subMessage : "";
        this.confirmAction = data.confirmAction ? data.confirmAction : "YES";
        this.cancelAction = data.cancelAction ? data.cancelAction : "NO";
        this.isWarnBotton = data.isWarnBotton ? data.isWarnBotton : false;
        this.notificationSuccess = data.notificationSuccess
            ? data.notificationSuccess
            : "ACTION_COMPLETED_SUCCESSFULLY";
        this.notificationFailMultiple = data.notificationFailMultiple;
    }

    ngOnInit(): void {
        this.controlForm = this._formBuilder.group({
        });
    }

    onSubmit(): void {
        this.isLoading = true;
        this.action.subscribe((response: any) => {
            this.isLoading = false;
            this.dialogRef.close(response);
        }, (error: any) => {
            this.isLoading = false;
            alert(error);
        });
    }
}
