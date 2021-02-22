import {Route} from '@angular/router';
import {ClusterDetailsComponent} from './index';
import {AuthGuard} from '../../../auth/auth.guard';
import {RoleGuard} from '../../../auth/role.guard';
import {ComponentMode} from '../../../shared/common/componentmode';

export const ClustersRoutes: Route[] = [
    { path: 'admin/clusters', component: ClusterDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
    { path: 'admin/clusters/view', component: ClusterDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}}
];
