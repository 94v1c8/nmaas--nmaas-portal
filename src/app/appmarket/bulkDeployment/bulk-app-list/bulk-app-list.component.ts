import {Component, OnInit, ViewChild} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkType} from '../../../model/bulk-replay';
import {ModalComponent} from '../../../shared';

@Component({
  selector: 'app-bulk-app-list',
  templateUrl: './bulk-app-list.component.html',
  styleUrls: ['./bulk-app-list.component.css']
})
export class BulkAppListComponent implements OnInit {

  public bulks: BulkDeployment[] = [];

  public mode = BulkType.APPLICATION;

  constructor(private readonly deployService: AppdeploymentService) { }

  ngOnInit(): void {
    this.deployService.getBulksAppDeployments().subscribe(data => {
      data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
      this.bulks = data
    });
  }
}