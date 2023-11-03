import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Id, Rate, Comment, FileInfo } from '../model';
import { AppConfigService } from './appconfig.service';
import { GenericDataService } from './genericdata.service';
import {catchError, debounceTime} from 'rxjs/operators';
import {AppStateChange} from '../model/appstatechange';
import {ApplicationBase} from '../model/application-base';
import {Application} from '../model/application';
import {ApplicationDTO} from '../model/application-dto';
import {ApplicationVersion} from '../model/application-version';

@Injectable({
    providedIn: 'root',
})
export class AppsService extends GenericDataService {

    constructor(http: HttpClient, appConfig: AppConfigService) {
      super(http, appConfig);
    }

    // application base

    public getAllActiveApplicationBase(): Observable<ApplicationBase[]> {
        return this.get<ApplicationBase[]>(this.appConfig.getApiUrl() + '/apps/base');
    }

    public getAllApplicationBase(): Observable<ApplicationBase[]> {
        return this.get<ApplicationBase[]>(this.appConfig.getApiUrl() + '/apps/base/all');
    }

    public getApplicationBase(id: number): Observable<ApplicationBase> {
        return this.get<ApplicationBase>(this.appConfig.getApiUrl() + '/apps/base/' + id);
    }

    public updateApplicationBase(app: ApplicationBase): Observable<any> {
        return this.patch(this.appConfig.getApiUrl() + '/apps/base', app);
    }

    public deleteAppBase(id: number): Observable<any> {
        return this.http.delete(this.appConfig.getApiUrl() + '/apps/base/' + id)
    }

    public hasRunningInstances(id: number): Observable<boolean> {
        return this.http.get<boolean>(this.appConfig.getApiUrl() + '/apps/instances/running/app/' + id);
    // application version

    public getApplicationVersions(id: number): Observable<ApplicationVersion[]> {
        return  this.get<ApplicationVersion[]>(this.appConfig.getApiUrl() + `/apps/versions/${id}`)
    }

    // application dto

    public getApplicationDTO(id: number): Observable<ApplicationDTO> {
        return this.get<ApplicationDTO>(this.appConfig.getApiUrl() + '/apps/' + id);
    }

    public getLatestVersion(appName: string): Observable<ApplicationDTO> {
        return this.get<ApplicationDTO>(this.appConfig.getApiUrl() + '/apps/' + appName + '/latest');
    }

    public createApplicationDTO(app: ApplicationDTO): Observable<any> {
        return this.post(this.appConfig.getApiUrl() + '/apps', app);
    }

    public updateApplicationDTO(app: ApplicationDTO): Observable<any> {
        return this.patch(this.appConfig.getApiUrl() + '/apps', app);
    }

    // application

    public createApplication(appVersion: Application): Observable<any> {
        return this.http.post(this.appConfig.getApiUrl() + '/apps/version', appVersion)
    }

    public updateApplication(appVersion: Application): Observable<any> {
        return this.http.patch(this.appConfig.getApiUrl() + '/apps/version', appVersion)
    }

    public getApplication(id: number): Observable<Application> {
        return this.http.get<Application>(this.appConfig.getApiUrl() + `/apps/version/${id}`)
    }

    public deleteApplication(appId: number): Observable<any> {
        return this.delete(this.appConfig.getApiUrl() + '/apps/' + appId);
    }

    public changeApplicationState(id: number, appStateChange: AppStateChange): Observable<any> {
        return this.patch(this.appConfig.getApiUrl() + '/apps/state/' + id, appStateChange);
    }

    // rate

    public getAppRateByUrl(urlPath: string): Observable<Rate> {
        if (urlPath != null && urlPath !== '') {
            return this.getByUrl(urlPath);
        }
    }

    public setMyAppRateByUrl(urlPath: string): Observable<any> {
        return this.http.post(this.appConfig.getApiUrl() + urlPath, null).pipe(
            debounceTime(10000),
            catchError((error: any) => observableThrowError((typeof error.json === 'function' ? error.json().message : 'Server error'))));
    }

    // comments

    public getAppCommentsByUrl(urlPath: string): Observable<Comment[]> {
        return this.getByUrl(urlPath);
    }

    public addAppCommentByUrl(urlPath: string, comment: Comment): Observable<Id> {
        return this.http.post<Id>(this.appConfig.getApiUrl() + urlPath, comment).pipe(
            debounceTime(10000),
            catchError((error: any) => observableThrowError((typeof error.json === 'function' ? error.json().message : 'Server error'))));
    }

    public deleteAppCommentByUrl(urlPath: string, id: Id): Observable<any> {
        return this.http.delete(this.appConfig.getApiUrl() + urlPath + '/' + id.id).pipe(
            debounceTime(10000),
            catchError((error: any) => observableThrowError((typeof error.json === 'function' ? error.json().message : 'Server error'))));
    }

    // screenshots

    public getAppScreenshotsByUrl(urlPath: string): Observable<FileInfo[]> {
        return this.getByUrl(urlPath);
    }

    public getAppScreenshotUrl(urlPath: string): string {
        return this.appConfig.getApiUrl() + urlPath;
    }

    public uploadScreenshot(id: number, file: any): Observable<FileInfo> {
        const fd: FormData = new FormData();
        fd.append('file', file);
        return this.post(this.appConfig.getApiUrl() + '/apps/' + id + '/screenshots', fd);
    }

    // logo

    public uploadAppLogo(id: number, file: any): Observable<FileInfo> {
        const fd: FormData = new FormData();
        fd.append('file', file);
        return this.post(this.appConfig.getApiUrl() + '/apps/' + id + '/logo', fd);
    }

    // misc

    private getByUrl(urlPath: string): Observable<any> {
        return this.http.get(this.appConfig.getApiUrl() + urlPath).pipe(
            debounceTime(10000),
            catchError((error: any) => observableThrowError((typeof error.json === 'function' ? error.json().message : 'Server error'))));
    }
}
