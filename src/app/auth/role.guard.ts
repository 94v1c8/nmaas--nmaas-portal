import {Role} from '../model/userrole';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(protected authService: AuthService, protected router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        const allowedRoles: Role[] = this.getAllowedRoles(route);
        console.debug('Allowed roles: ' + allowedRoles);

        for (let i = 0; i < allowedRoles.length; i++) {
            console.debug('Checking role: ' + allowedRoles[i]);
            if (this.authService.hasRole(Role[allowedRoles[i]])) {
                console.debug('Allowed');
                return true;
            }
        }
        console.debug('Not allowed');
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }

    protected getAllowedRoles(route: ActivatedRouteSnapshot): Role[] {
        const roles: Role[] = [];

        if (route === undefined || route.data === undefined || route.data.roles === undefined) {
            throw new Error('Missing allowed roles');
        }

        console.debug('ROLEGUARD: roles ' + route.data.roles);

        if (Array.isArray(route.data.roles)) {
            console.debug('ROLEGUARD: roles length: ' + route.data.roles.length);
            for (let i = 0; i < route.data.roles.length; i++) {
                console.debug('ROLEGUARD: role: ' + route.data.roles[i]);
                roles.push(Role[(<string>route.data.roles[i])]);
            }
        } else if (typeof route.data.roles === 'string') {
            roles.push(Role[route.data.roles]);
        }

        console.debug('ROLEGUARD: return roles ' + roles);

        return roles;
    }

    protected isRoleIn(role: Role, roles: Role[]): boolean {
        return (roles.indexOf(role) > -1);
    }

}
