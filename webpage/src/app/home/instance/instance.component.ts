import { VmService } from '../../services/vm.service';
import { Instance } from '../../models/instance';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { isDefined } from '@angular/compiler/src/util';

export interface ImageData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css']
})
export class InstanceComponent implements OnInit {
  @Input() instance: Instance;

  imageData: ImageData;

  constructor(
    private vmService: VmService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  start(){
    this.vmService.startInstance(this.instance.name)
    .subscribe(
      data=>{
        alert("Successful Started");
        location.reload();
      },
      error=>console.log(error)
    )
  }

  shutdown(){
    this.vmService.shutoffInstance(this.instance.name)
    .subscribe(
      data=>{
        alert("Successful Shutdown");
        location.reload();
      },
      error=>console.log(error)
    )
  }

  reboot(){
    this.vmService.rebootInstance(this.instance.name)
    .subscribe(
      data=>{
        alert("Successful Rebooted");
        location.reload();
      },
      error=>console.log(error)
    )
  }

  delete(){
    this.vmService.deleteInstance(this.instance.name)
    .subscribe(
      data=>{
        alert("Successful Deleted");
        location.reload();
      },
      error=>console.log(error)
    )
  }

  openImageDialog(): void {
    const dialogRef = this.dialog.open(DialogImageCreate, {
      width: '250px',
      data: {name: "", description: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.imageData = result;
      if(isDefined(this.imageData)){
        this.vmService.createImage(this.instance.name, this.imageData.name, this.imageData.description)
      .subscribe(
        data=>{
          alert("Successful Created");
        },
        error=>alert("Failed")
      )
      }
      
    });
  }
  
}


@Component({
  selector: 'dialog-image-create',
  templateUrl: 'image-create.html'
})
export class DialogImageCreate{
  constructor(
    public dialogRef: MatDialogRef<DialogImageCreate>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}