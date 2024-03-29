import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorInfra } from 'src/app/shared/services/error-infra.service';

export interface DialogData {
  name: string;
  imagePath: any;
  audioPath:any;
}

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})

export class AddDialogComponent implements OnInit {
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

  constructor(
    private domSanitizer: DomSanitizer,
    public errorInfra: ErrorInfra,
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  // open the file explorer for the user to allow him to select an image
  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.fileToUpload = this.selectedFiles[0];

      let ext =  this.fileToUpload.name.match(/\.([^\.]+)$/)[1];
      
      if(ext === 'jpg' || ext === 'PNG' || ext === 'jpeg')
      {
        // show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrl = event.target.result;
          this.data.imagePath = this.imageUrl;
        }
        reader.readAsDataURL(this.fileToUpload);
      }
      else{
        this.errorInfra.openSimleSnackBar('סוג הקובץ אינו נתמך במערכת', 'סגור');
      }
   }
  } 

   // open the file explorer for the user to allow him to select an image
   setFileField(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.fileToUpload = this.selectedFiles[0];
      let ext =  this.fileToUpload.name.match(/\.([^\.]+)$/)[1];
      
      if(ext === 'mp3' || ext === 'mp4' || ext === 'webm')
      {
        // show audio preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.audioUrl = this.domSanitizer.bypassSecurityTrustUrl(event.target.result);
          this.data.audioPath = this.audioUrl.changingThisBreaksApplicationSecurity;
        }
      reader.readAsDataURL(this.fileToUpload);
      }
      else{
        this.errorInfra.openSimleSnackBar('סוג הקובץ אינו נתמך במערכת', 'סגור');
      }
   }
  }
}
