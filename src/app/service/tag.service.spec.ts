/* tslint:disable:no-unused-variable */

import { TestBed, inject} from '@angular/core/testing';
import { TagService } from './tag.service';
import {Observable, of} from 'rxjs';
import {Configuration} from '../model/configuration';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';

class MockConfigurationService {
    protected uri: string;

    constructor() {
        this.uri = 'http://localhost/api';
    }

    public getApiUrl(): string {
        return 'http://localhost/api';
    }

    public getConfiguration(): Observable<Configuration> {
        return of<Configuration>();
    }

    public updateConfiguration(configuration: Configuration): Observable<any> {
        return of<Configuration>();
    }
}

describe('TagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagService, HttpHandler, HttpClient, {provide: AppConfigService, useClass: MockConfigurationService}]
    });
  });

  it('should ...', inject([TagService], (service: TagService) => {
    expect(service).toBeTruthy();
  }));
});
