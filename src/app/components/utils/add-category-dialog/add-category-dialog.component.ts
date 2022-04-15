import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
  imagePath: any;
}

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})

export class AddCategoryDialogComponent implements OnInit {

  selectedFiles?: FileList;
  audioFile?:FileList;
  selectedFileNames: string[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  audioUrl: any;
  duration: number;
  fileToUpload: any;
  imageUrl: any;

  constructor(public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.fileToUpload = this.selectedFiles[0];

      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.data.imagePath = this.imageUrl;
      }
      reader.readAsDataURL(this.fileToUpload);
   }
  } 
}

