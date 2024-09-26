import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DialogServiceService } from './services/dialog-service.service';
import { MatDialog } from '@angular/material/dialog';
import { PairDialogComponent } from './dialogs/pair-dialog/pair-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  dialog = inject(MatDialog);



  constructor(private dialogService: DialogServiceService){}

  openDialog() {
    let currentData;

    console.log('Klik na dugme')
    this.dialogService.triggerFunctionCall();
    currentData = this.dialogService.getData();
    //currentData.subscribe(x => console.log(x))

    this.dialog.open(PairDialogComponent, {
      data: currentData
    });
  }
}
