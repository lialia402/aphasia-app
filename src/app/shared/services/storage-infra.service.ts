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

  /** This function called from the add-phrase form (you can use it from different pages also).
   * How does it work?
   * This function checks if the type is image, if it is then it uploads it to
   * <email>/images/<name_of_file>.jpg on the storage.
   * same with audio file.
   * 
   * This function also updates the progress of the upload 
   * for each image and audio seperatly.
   * 
   * @param path The native path of the fine on the device.
   * @param type The type of the file (Example: 'data:audio/mp3;base64' for audio file)
   * @returns a new promise with the new url, on error - undefine
   */
  public uploadFileByPath(path : any, type:any) {
    debugger;
    return new Promise((resolve, reject) => {
      let user = this.authentication.afAuth.currentUser.then(user => user?.email)

      //if the file is an image file
      if (type.includes("image")) {
        this.imageUploadPercentage = 0
        const imageFolder = "/images/";
        let storage_path = imageFolder + this.createFileName() + ".jpg";//create the path on the storage

        this.imageRef = firebase.storage().ref(storage_path);

        let task = this.imageRef.putString(path, "data_url")

        task.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot: firebase.storage.UploadTaskSnapshot) => {

            this.imageUploadPercentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          }
        );

        task.then(() => {
          // this.imageDownloadURL = url.downloadURL;
          // resolve(this.imageDownloadURL)
          this.imageDownloadURL = task.snapshot.downloadURL;
          resolve(this.imageDownloadURL)

        })

      }
      //if the file is an audio file
      else if (type.includes("audio")) {
        this.audioUploadPercentage = 0
        const audioFolder = "/audio/";

        let storage_path = user + audioFolder + this.createFileName() + ".mp3";//create the path on the storage
        const task = firebase.storage().ref(storage_path).putString(type + path, "data_url")

        task.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot: firebase.storage.UploadTaskSnapshot) => {
            this.audioUploadPercentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          }
        );

        task.then(async (url:any) => {
          this.audioDownloadURL = url.downloadURL;
          resolve(this.audioDownloadURL)
        });


      }

      else {
        reject("null")
      }
    })
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