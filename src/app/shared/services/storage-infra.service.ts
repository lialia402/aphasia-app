import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageInfraProvider {

  //float of uploaded percentage.
  public imageUploadPercentage;
  public audioUploadPercentage;

  public imageRef : any;
  public imageDownloadURL: any;
  public audioDownloadURL: any;

  constructor(private storage: AngularFireStorage, public authentication: AuthService, ) {
    this.imageUploadPercentage = 0;
    this.audioUploadPercentage = 0;

  }

    public uploadFile = (file:any, type:any) => {
    let folderName;
    let storage_path
    if(type.includes("image"))
    {
      folderName = "/images/";
      storage_path = folderName + this.createFileName() + ".jpg";
    }
    
    else
    {
      folderName = "/audio/";
      storage_path = folderName + this.createFileName() + ".mp3";//create the path on the storage
    }
  
    let uploadTask = firebase.storage().ref(storage_path).putString(file, "data_url")
    return uploadTask.
      then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then((url) => {
        return url
      });
  }

  //this function creates random file-name (without extention) based on time.
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n;
    return newFileName;
  }


  public getImagePercentage() {
    return this.imageUploadPercentage;
  }

  public getAudioPercentage() {
    return this.audioUploadPercentage;
  }

  public showImageProgressBar() {
    if (this.imageUploadPercentage == 0 || this.imageUploadPercentage == 100)
      return false;
    return true;
  }

  public showAudioProgressBar() {
    if (this.audioUploadPercentage == 0 || this.audioUploadPercentage == 100)
      return false;
    return true;
  }
}