import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal.component';

@Component({
  selector: 'modal-provide-ssh-key',
  templateUrl: './modal-provide-ssh-key.component.html',
  styleUrls: ['./modal-provide-ssh-key.component.css']
})
export class ModalProvideSshKeyComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  constructor() { }

  ngOnInit() {
    if (this.modal !== undefined) {
      this.modal.setModalType('info');
      this.modal.setStatusOfIcons(true);
    }
  }

}
