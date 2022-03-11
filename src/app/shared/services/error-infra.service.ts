import { Injectable } from '@angular/core';


/**
 * Provider for handling commen error 
 * we should use this provider to show th user an error message
 */


const TOAST_DURATION = 4000//toast duration in milliseconds

@Injectable()
export class ErrorInfra {

  constructor(
  ) { }

  /** display a simple toast to the screen
   * the toast will be in the bottom of the screen and display for TOAST_DURATION
   * @param message the error message display to the user
   */
  public simpleToast(message: any) {

  }

  /** display a short toast to the screen
   * the toast will be in the bottom of the screen and display for TOAST_DURATION/2
   * @param message the error message display to the user
   */
  public shortToast(message: any) {
  }

  /** display complex toast to the screen
   * the toast will be in the bottom of the screen and display for TOAST_DURATION
   * @param message  the error message display to the user
   * @param buttonText the text to disply on the button, the defulte is "סגור"
   */
  public toastWithButton(message: any, buttonText:any) {
  }

  /** display an alert dialog on the screen
   * the dialog close on user click
   * @param headline the alert headline display in big font
   * @param message the alert message to inform the user
   */
  public alert(headline:any, message:any) {
  }


  public waitAlert(headline:any , message:any) : Promise<boolean> {
    return new Promise((resolve, reject) => {
            return false;
    });
  }
}