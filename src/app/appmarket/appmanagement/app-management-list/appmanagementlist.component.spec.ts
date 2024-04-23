import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppManagementListComponent } from './appmanagementlist.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppConfigService, AppsService} from '../../../service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../../../auth/auth.service';
import {AppChangeStateModalComponent} from '../app-change-state-modal/appchangestatemodal.component';
import {ModalComponent} from '../../../shared/modal';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MockAuthService} from '../../appmarket.component.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppManagementListComponent', () => {
  let component: AppManagementListComponent;
  let fixture: ComponentFixture<AppManagementListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
          AppManagementListComponent,
          AppChangeStateModalComponent,
          ModalComponent
      ],
      providers: [
          AppsService,
          AppConfigService,
          {provide: AuthService, useClass: MockAuthService}
        ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
