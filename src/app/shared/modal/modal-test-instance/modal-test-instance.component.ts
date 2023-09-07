import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal.component';

@Component({
  selector: 'modal-test-instance',
  templateUrl: './modal-test-instance.component.html',
  styleUrls: [],
  providers: [ModalComponent]
})
export class ModalTestInstanceComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  ngOnInit() {
    if (this.modal !== undefined) {
      this.modal.setModalType('info');
      this.modal.setStatusOfIcons(true);
    }
  }

}
