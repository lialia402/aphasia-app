import { Injectable } from '@angular/core';
import { TestInfo } from '../models/test-info.model';
import { FirebaseInfraService } from './firebase-infra.service';

@Injectable({
  providedIn: 'root'
})
export class EquizInfraService {

  public tests: TestInfo[]=[];
  
  constructor(
    public firebaseInfraService: FirebaseInfraService,
  ) { }

  public getTests(): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestInfo();
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public getTestsByEmail(email:string): Promise<TestInfo[]> {
    this.firebaseInfraService.importTestsByEmail(email);
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.getTestInfosObservable.subscribe(arrayOfResults => {
        this.tests = arrayOfResults;
        resolve(arrayOfResults);
      })
    })
  }

  public addTestInfo(testInfo:TestInfo)
  {
    return new Promise((resolve, reject) => {
      this.firebaseInfraService.addTestResult(testInfo)?.then(() => {
        resolve(testInfo);
      });
    })
  }
}
