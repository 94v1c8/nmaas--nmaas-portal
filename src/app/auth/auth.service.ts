
import {throwError as observableThrowError, Observable, Subject, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AppConfigService} from '../service/appconfig.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Authority} from '../model/authority';
import {catchError, debounceTime} from 'rxjs/operators';

export class DomainRoles {
  constructor(private domainId: number, private roles: string[] = []) {
  }

  public getDomainId(): number {
    return this.domainId;
  }

  public getRoles(): string[] {
    return this.roles;
  }

  public hasRole(role: string): boolean {
    return (this.roles != null ? this.roles.indexOf(role) >= 0 : false);
  }
}

@Injectable()
export class AuthService {
  public loginUsingSsoService: boolean;

  private readonly isLoggedInSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient,
              private appConfig: AppConfigService,
              private jwtHelper: JwtHelperService) {
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.appConfig.config.tokenName, token);
  }

  private getToken(): string {
    return localStorage.getItem(this.appConfig.config.tokenName)
  }

  private removeToken(): void {
    localStorage.removeItem(this.appConfig.config.tokenName);
  }

  public getSelectedLanguage(): string {
    if (localStorage.getItem('lang') != null) {
      return localStorage.getItem('lang')
    }
    return this.getToken() != null ? this.jwtHelper.decodeToken(this.getToken()).language : undefined;
  }

  public getUsername(): string {
    const token = this.getToken();
    return (token ? this.jwtHelper.decodeToken(token).sub : null);
  }

  public hasRole(name: string): boolean {
    const token = this.getToken();
    const authorities: Authority[] = this.jwtHelper.decodeToken(token).scopes;
    for (let i = 0; i < authorities.length; i++) {
      if (authorities[i].authority.indexOf(name) > -1) {
        return true;
      }
    }
    return false;
  }

  public hasDomainRole(domainId: number, name: string): boolean {
    const token = this.getToken();
    const authorities: Authority[] = this.jwtHelper.decodeToken(token).scopes;
    for (let i = 0; i < authorities.length; i++) {
      if (authorities[i].authority.indexOf(domainId + ':' + name) > -1) {
        return true;
      }
    }
    return false;
  }

  public getDomainRoles(): Map<number, DomainRoles> {
    const drMap: Map<number, DomainRoles> = new Map<number, DomainRoles>();

    const token = this.getToken();
    if (token == null) {
      return drMap;
    }

    const authorities: Authority[] = this.jwtHelper.decodeToken(token).scopes;
    if (authorities == null) {
      return drMap;
    }

    for (let index = 0; index < authorities.length; index++) {
      if (authorities[index].authority === undefined) {
        continue;
      }

      const domainRole: string[] = authorities[index].authority.split(':', 2);
      if (domainRole.length !== 2) {
        continue;
      }
      const domainId: number = Number.parseInt(domainRole[0], 10);
      const role: string = domainRole[1];

      let dr: DomainRoles;
      if (!drMap.has(domainId)) {
        drMap.set(domainId, new DomainRoles(domainId, []));
      }
      dr = drMap.get(domainId);
      dr.getRoles().push(role);
    }

    return drMap;
  }

  public getRoles(): string[] {
    const roles: string[] = [];

    const token = this.getToken();
    if (token == null) {
      return roles;
    }

    const authorities: Authority[] = this.jwtHelper.decodeToken(token).scopes;
    for (let index = 0; index < authorities.length; index++) {
      if (authorities[index].authority === undefined) {
        continue;
      }

      const domainRole: string[] = authorities[index].authority.split(':', 2);
      if (domainRole.length !== 2) {
        continue;
      }
      const role: string = domainRole[1];
      if (roles.indexOf(role) === -1) {
        roles.push(role);
      }
    }
    return roles;
  }


  public getDomains(): number[] {
    const domains: number[] = [];

    const token = this.getToken();
    if (token == null) {
      return domains;
    }

    const authorities: Authority[] = this.jwtHelper.decodeToken(token).scopes;

    for (let index = 0; index < authorities.length; index++) {
      if (authorities[index].authority === undefined) {
        continue;
      }

      const domainIdStr: string[] = authorities[index].authority.split(':', 1);
      if (domainIdStr.length === 0) {
        continue;
      }
      const domainId: number = Number.parseInt(domainIdStr[0], 10);
      if (domains.indexOf(domainId) === -1) {
        domains.push(domainId);
      }
    }
    return domains;
  }

  public getDomainsWithRole(name: string): number[] {
    const domainsWithRole: number[] = [];

    const domains: number[] = this.getDomains();
    domains.forEach((domainId) => {
      if (this.hasDomainRole(domainId, name)) {
        domainsWithRole.push(domainId);
      }
    });

    return domainsWithRole;
  }

  public login(username: string, password: string): Observable<boolean> {
    // hack so test instance modal is shown onl after login
    localStorage.setItem(this.appConfig.getTestInstanceModalKey(), 'True');

    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    return this.http.post(this.appConfig.config.apiUrl + '/auth/basic/login',
        JSON.stringify({'username': username, 'password': password}), {headers: headers}).pipe(
        debounceTime(10000),
        map((response: Response) => {
          console.debug('Login response: ' + response.statusText);
          // login successful if there's a jwt token in the response
          const token = response && response['token'];
          if (token) {
            // set token property
            this.storeToken(token);

            console.debug('AUTH | User: ' + this.getUsername());
            console.debug('AUTH | Domains: ' + this.getDomains());
            console.debug('AUTH | Roles: ' + this.getRoles());
            console.debug('AUTH | DomainRoles: ' + this.getDomainRoles());
            this.loginUsingSsoService = false;
            this.isLoggedInSubject.next(true);
            return true;
          } else {
            // return false to indicate failed login
            this.isLoggedInSubject.next(false);
            return false;
          }
        }),
        catchError((error) => {
          let message: string;
          if (error.error['message']) {
            message = error.error['message'];
          } else {
            message = 'Server error';
          }

          console.debug(error['status'] + ' - ' + message);
          return observableThrowError(error);
        }));
  }

  public propagateSSOLogin(userid: string): Observable<boolean> {
    console.debug('propagateSSOLogin');
    console.debug('propagateSSOLogin ' + this.appConfig.config.apiUrl);
    console.debug('propagateSSOLogin ' + this.appConfig.config.apiUrl + '/auth/sso/login');
    console.debug('propagateSSOLogin ' + userid);
    // hack so test instance modal is shown onl after login
    localStorage.setItem(this.appConfig.getTestInstanceModalKey(), 'True');

    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    return this.http.post(this.appConfig.config.apiUrl + '/auth/sso/login',
        JSON.stringify({'userid': userid}), {headers: headers}).pipe(
        debounceTime(10000),
        map((response: Response) => {
          console.debug('SSO login response: ' + response);
          // login successful if there's a jwt token in the response
          const token = response && response['token'];

          if (token) {
            this.storeToken(token);
            console.debug('SSO AUTH | User: ' + this.getUsername());
            console.debug('SSO AUTH | Domains: ' + this.getDomains());
            console.debug('SSO AUTH | Roles: ' + this.getRoles());
            console.debug('SSO AUTH | DomainRoles: ' + this.getDomainRoles());
            this.loginUsingSsoService = true;
            this.isLoggedInSubject.next(true);
            return true;
          } else {
            // return false to indicate failed login
            this.isLoggedInSubject.next(false);
            return false;
          }
        }),
        catchError((error) => {
          console.error('SSO login error: ' + error.error['message']);
          return observableThrowError(error);
        }));
  }

  public logout(): void {
    this.removeToken();
  }

  public isLogged(): boolean {
    const token = this.getToken();
    if (token == null) {
      return false;
    }
    return (token ? !this.jwtHelper.isTokenExpired(token) : false);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.pipe(
        debounceTime(100), // use debounceTime to aggregate multiple emissions https://rxjs.dev/api/operators/debounceTime
    );
  }

}
