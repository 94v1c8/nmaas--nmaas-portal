import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationService} from '../../../service';
import {ConfigurationDetailsComponent} from './details/configurationdetails.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared';
import {AuthModule} from '../../../auth/auth.module';
import {PipesModule} from '../../../pipe/pipes.module';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InternationalizationService} from "../../../service/internationalization.service";
import {ClustersModule} from '../clusters/clusters.module';

@NgModule({
    declarations: [
        ConfigurationDetailsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        AuthModule,
        FormsModule,
        PipesModule,
        TranslateModule.forChild(),
        ClustersModule
    ],
  providers: [
      ConfigurationService,
      InternationalizationService
  ]
})
export class ConfigurationModule { }
