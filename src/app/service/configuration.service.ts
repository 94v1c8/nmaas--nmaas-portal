import {Injectable} from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {Observable} from 'rxjs';
import {Configuration} from '../model/configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends GenericDataService{

  protected uri: string;

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
    this.uri = this.appConfig.getApiUrl() + '/configuration/'
  }

  public getConfiguration(): Observable<Configuration> {
    return this.get<Configuration>(this.uri);
  }

  public updateConfiguration(configuration: Configuration): Observable<any>{
    return this.put(this.uri + configuration.id, configuration);
  }

}
