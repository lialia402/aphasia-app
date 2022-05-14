import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: string;
}
@Component({
  selector: 'app-add-dialog-patient',
  templateUrl: './add-dialog-patient.component.html',
  styleUrls: ['./add-dialog-patient.component.scss']
})
export class AddDialogPatientComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddDialogPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit(): void {
  }

}
