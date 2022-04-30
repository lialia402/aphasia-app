import { Component, OnInit } from '@angular/core';
import { AddDialogPatientComponent } from '../utils/add-dialog-patient/add-dialog-patient.component';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../utils/confirmation-dialog/confirmation-dialog.component';
import { CategoryClass } from 'src/app/shared/models/category-class.model';
import { CategoryInfraService } from 'src/app/shared/services/category-infra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageInfraProvider } from 'src/app/shared/services/storage-infra.service';
import { AddCategoryDialogComponent } from '../utils/add-category-dialog/add-category-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-therapist-panel',
  templateUrl: './therapist-panel.component.html',
  styleUrls: ['./therapist-panel.component.scss']
})
export class TherapistPanelComponent implements OnInit {

  patientID: any;
  constructor(public authService: AuthService, private route: ActivatedRoute, public categoryService: CategoryInfraService, public router: Router ,public dialog: MatDialog, public storageService: StorageInfraProvider) 
  {
    
  }
  ngOnInit(): void {
   
  }

  async addNewPatient() {
    const dialogRef = this.dialog.open(AddDialogPatientComponent, {
      height: '445px',
      width: '350px',
      data: {patientID: this.patientID}
    });
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        // go to storage to add word
        console.log(result);
        this.categoryService.addCategory(newCategory);
      }
    });
  }

}
