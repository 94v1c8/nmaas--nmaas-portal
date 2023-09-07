import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AppsService} from '../../service';
import {AppSubscriptionsService} from '../../service/appsubscriptions.service';
import {UserDataService} from '../../service/userdata.service';
import {AppViewType} from '../../shared/common/viewtype';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {SortService} from '../../service/sort.service';
import {SortableColumnComponent} from '../../shared/sortable-column/sortable-column.component';
import {SortableTableDirective} from '../../shared/sortable-column/sortable-table.directive';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'nmaas-applications',
    templateUrl: './applist.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    providers: [AppsService, AppSubscriptionsService, SortService, SortableTableDirective, SortableColumnComponent]
})
export class AppListComponent implements OnInit, OnDestroy {

    public AppViewType = AppViewType;

    public appsView: AppViewType;
    public domainId: number;

    public selectedDomain: Subscription;

    constructor(protected userDataService: UserDataService,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private location: Location) {
    }

    ngOnInit() {
        if (this.route.snapshot.data.appViewType !== undefined) {
            this.appsView = AppViewType.APPLICATION;
        } else {
            this.appsView = this.route.snapshot.data.appView;
        }

        this.selectedDomain = this.userDataService.selectedDomainId.subscribe(domainId => {
            if (domainId !== 0) {
                // if domain id is not equal 0, it is assumed that everything works just fine
                this.domainId = domainId;
            } else {
                // otherwise, user domain id's are selected and first one is chosen, usually global domain
                const domains = this.authService.getDomains();
                this.domainId = domains.length > 0 ? domains[0] : 0;
                this.userDataService.selectDomainId(this.domainId);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.selectedDomain !== undefined) {
            this.selectedDomain.unsubscribe();
        }
    }
}
