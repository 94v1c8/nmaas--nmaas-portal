import {AuthService} from '../../../auth/auth.service';
import {User} from '../../../model/user';
import {Role} from '../../../model/userrole';
import {DomainService} from '../../../service/domain.service';
import {UserService} from '../../../service/user.service';
import {UserDataService} from '../../../service/userdata.service';
import {Component, OnInit} from '@angular/core';
import {ComponentMode} from '../../../shared/common/componentmode';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})
export class UsersListComponent implements OnInit {

  public ComponentMode = ComponentMode;

  private domainId: number;

  public allUsers: User[] = [];
  public usersToAdd: User[] = [];
  //  private domainUsers: Map<number, User[]> = new Map<number, User[]>();

  public isInAddToDomainMode = false;

  constructor(protected authService: AuthService,
    protected userService: UserService,
    protected domainService: DomainService,
    protected userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {}


  ngOnInit() {
    this.userDataService.selectedDomainId.subscribe((domainId) => this.update(domainId));
  }

  public update(domainId: number): void {
    console.log('Update users for domainId=' + domainId);
    if (domainId == null || domainId === 0) {
      this.domainId = undefined;
    } else {
      this.domainId = domainId;
    }

    let users: Observable<User[]> = null;

    if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN])) {
      users = this.userService.getAll(this.domainId);
    } else if (this.domainId != null && this.authService.hasDomainRole(this.domainId, Role[Role.ROLE_DOMAIN_ADMIN])) {
      users = this.userService.getAll(this.domainId);
    } else {
      users = of<User[]>([]);
    }
    // sort default user list by username
    users = users.pipe(
        map(userList => userList.sort((a, b) => a.username.localeCompare(b.username)))
    )

    users.subscribe((all) => {
      this.allUsers = all;
      /* parse date strings to date objects */
      for (const u of this.allUsers) {
        if (u.firstLoginDate) {
          u.firstLoginDate = new Date(u.firstLoginDate)
        }
        if (u.lastSuccessfulLoginDate) {
          u.lastSuccessfulLoginDate = new Date(u.lastSuccessfulLoginDate)
        }
      }
    });

    if (this.domainId !== this.domainService.getGlobalDomainId()) {
      this.userService.getAll().subscribe(
          all => {
            this.usersToAdd = all.filter(
                u => u.roles.filter(r => r.domainId === this.domainId).length === 0 && // user has no roles in current domain
                u.roles.filter(r => this.userRoleAsEnum(r.role) === Role.ROLE_GUEST && // user has role guest in global domain
                    r.domainId === this.domainService.getGlobalDomainId()).length === 1);
            for (const u of this.usersToAdd) {
              if (u.firstLoginDate) {
                u.firstLoginDate = new Date(u.firstLoginDate)
              }
              if (u.lastSuccessfulLoginDate) {
                u.lastSuccessfulLoginDate = new Date(u.lastSuccessfulLoginDate)
              }
            }
          }
      );
    }

  }

  public onUserView($event): void {
    this.router.navigate(['/admin/users/view/', $event]);
  }

  public onRemoveRole($event): void {
    this.userService.removeRole(
        $event.id, $event.roles.find(value => value.domainId === this.domainId).role, this.domainId).subscribe(
            () => this.update(this.domainId)
        )
  }

  public onUserDelete($event): void {
    this.userService.deleteOne($event.id).subscribe(
        () => this.update(this.domainId)
    )
  }

  public onUserAddToDomain($event): void {
    this.userService.addRole($event.id, Role.ROLE_USER, this.domainId).subscribe(() => this.update(this.domainId))
  }

  public onModeChange($event): void {
    this.isInAddToDomainMode = !this.isInAddToDomainMode;
  }

  public userRoleAsEnum(role: string | Role): Role {
    if (typeof role === 'string') {
      return Role[role];
    }
    return role;
  }

}
