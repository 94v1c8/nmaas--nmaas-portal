import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GenericDataService} from './genericdata.service';

import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';

import {Password} from '../model';
import {User} from '../model';
import {UserRole, Role} from '../model/userrole';
import {DomainService} from './domain.service';
import {PasswordReset} from '../model/passwordreset';
import {catchError, debounceTime} from 'rxjs/operators';

@Injectable()
export class UserService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService, protected domainService: DomainService) {
    super(http, appConfig);
  }

  public getAll(domainId?: number): Observable<User[]> {
    return this.get<User[]>(domainId === undefined || domainId === this.domainService.getGlobalDomainId() ?
        this.getUsersUrl() : this.getDomainUsersUrl(domainId));
  }

  public getOne(userId: number, domainId?: number): Observable<User> {
    return this.get<User>((domainId === undefined ? this.getUsersUrl() : this.getDomainUsersUrl(domainId)) + userId);
  }

  public deleteOne(userId: number, domainId?: number): Observable<any> {
    return this.delete<any>((domainId === undefined ? this.getUsersUrl() : this.getDomainUsersUrl(domainId)) + userId);
  }

  public getRoles(userId: number, domainId?: number): Observable<UserRole[]> {
    return this.get<UserRole[]>((domainId === undefined ? this.getUsersUrl() : this.getDomainUsersUrl(domainId)) + userId + '/roles');
  }

  public updateUser(userId: number, user: User): Observable<any> {
    return this.put<User, any>(this.getUsersUrl() + userId, user);
  }

  public completeRegistration(user: User): Observable<any> {
    return this.http.post<User>(this.getUsersUrl() + 'complete', user).pipe(
        debounceTime(this.appConfig.getHttpTimeout()), catchError(this.handleError));
  }

  public changeUserStatus(userId: number, enabled: boolean): Observable<any> {
    return this.put(this.getEnableOrDisableUsersUrl(userId, enabled), {params: null});
  }

  public completeAcceptance(username: string): Observable<any> {
    return this.post(this.getUserAcceptanceUrl() + username, {});
  }

  public addRole(userId: number, role: Role, domainId?: number): Observable<any> {
    const url: string = (domainId === undefined ? this.getUsersUrl() : this.getDomainUsersUrl(domainId)) + userId + '/roles';
    const targetDomainId: number = (domainId === undefined ? this.appConfig.getNmaasGlobalDomainId() : domainId);

    return this.post<UserRole, UserRole>(url, new UserRole(targetDomainId, role));
  }

  public removeRole(userId: number, role: Role, domainId?: number): Observable<void> {
    return this.delete<void>((domainId === undefined ? this.getUsersUrl() : this.getDomainUsersUrl(domainId)) + userId + '/roles/' + role);
  }

  public changePassword(passwordChange: Password): Observable<void> {
    return this.post<Password, void>(this.getUsersUrl() + 'my/auth/basic/password', passwordChange);
  }

  public validateResetRequest(token: string): Observable<User> {
    return this.post<string, User>(this.getUsersUrl() + 'reset/validate', token);
  }

  public resetPassword(passwordReset: PasswordReset, token: string): Observable<any> {
    return this.post<PasswordReset, any>(this.getUsersUrl() + 'reset?token=' + token, passwordReset);
  }

  public resetPasswordNotification(email: string): Observable<any> {
    return this.post<string, any>(this.getUsersUrl() + 'reset/notification', email);
  }

  public setUserLanguage(userId: number, selectedLanguage: string): Observable<any> {
    return this.patch(this.getUsersUrl() + userId + '/language?defaultLanguage=' + selectedLanguage, null);
  }

  protected getUsersUrl(): string {
    return this.appConfig.getApiUrl() + '/users/';
  }

  protected getDomainUsersUrl(domainId: number): string {
    return this.appConfig.getApiUrl() + '/domains/' + domainId + '/users/';
  }

  public getDomainUsersAsAdmin(domainId: number): Observable<User[]> {
    return this.get<User[]>(this.appConfig.getApiUrl() + '/domains/' + domainId + '/users/admin');
  }

  protected getUserAcceptanceUrl(): string {
    return this.appConfig.getApiUrl() + '/users/terms/';
  }

  protected getEnableOrDisableUsersUrl(userId: number, enabled: boolean): string {
      return this.appConfig.getApiUrl() + '/users/status/' + userId + '?enabled=' + enabled;
  }

  public getUserBySearch(search: string, domainId: number): Observable<User[]> {
    let params = new HttpParams();
    params = params.append('searchPart', search);
    params = params.append('domainId', domainId.toString())
    return this.http.get<User[]>(`${this.appConfig.getApiUrl()}/users/search`, {params})
  }
}
