import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from "../../../../shared/modal";
import {AppInstanceService} from "../../../../service";

@Component({
  selector: 'nmaas-modal-app-restart',
  templateUrl: './app-restart-modal.component.html',
  styleUrls: ['./app-restart-modal.component.css'],
    providers:[ModalComponent]
})
export class AppRestartModalComponent implements OnInit {

    @ViewChild(ModalComponent, { static: true })
    public readonly modal: ModalComponent;

    @Input()
    private appInstanceId: number;

    @Input()
    private domainId: number;

    constructor(private appInstanceService:AppInstanceService) {
    }

    ngOnInit() {

    }

    public show(){
        this.modal.show();
    }

    public restart(){
        this.appInstanceService.restartAppInstance(this.appInstanceId).subscribe(() =>this.modal.hide());
    }
}
