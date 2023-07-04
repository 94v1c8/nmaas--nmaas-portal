import {Component, Output} from '@angular/core';
import {BaseComponent} from '../../../../shared/common/basecomponent/base.component';
import {OnInit} from '@angular/core';
import {Cluster} from '../../../../model/cluster';
import {ClusterService} from '../../../../service/cluster.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentMode} from '../../../../shared';

@Component({
    selector: 'app-clusterdetails',
    templateUrl: './clusterdetails.component.html',
    styleUrls: ['./clusterdetails.component.css']
})
export class ClusterDetailsComponent extends BaseComponent implements OnInit {
    public cluster: Cluster;

    @Output()
    public error: string;

    constructor(private clusterService: ClusterService, private route: ActivatedRoute, private router: Router) {
        super();
    }

    ngOnInit() {
        this.clusterService.getCluster().subscribe(cluster => {
            this.cluster = cluster;
            // this.router.navigate(['/admin/clusters/view']);
        }, () => {
            this.cluster = new Cluster();
            this.mode = ComponentMode.CREATE;
        });
    }

    public onSave($event) {
        const upCluster: Cluster = $event;
        if (!upCluster) { return; }
        if (this.isInMode(ComponentMode.CREATE)) {
            this.clusterService.add(upCluster)
                .subscribe(() => this.router.navigateByUrl('/admin/clusters'), err => this.error = err.message);
        } else {
            this.clusterService.update(upCluster)
                .subscribe(() => this.router.navigateByUrl('/admin/clusters'), err => this.error = err.message);
        }
    }

    public onDelete($event): void {
        this.clusterService.remove($event).subscribe(() => this.router.navigate(['/admin/clusters/']));
    }
}
