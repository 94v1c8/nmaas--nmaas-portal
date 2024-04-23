import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteComponent } from './complete.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../service';
import {ProfileService} from '../../service/profile.service';
import {AuthService} from '../../auth/auth.service';
import {InternationalizationService} from '../../service/internationalization.service';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {ModalComponent} from '../../shared/modal';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CompleteComponent', () => {
    let component: CompleteComponent;
    let fixture: ComponentFixture<CompleteComponent>;

    beforeEach(waitForAsync(() => {
        const authServiceSpy = createSpyObj('AuthService', ['hasRole']);
        authServiceSpy.hasRole.and.returnValue(true)

        const internationalizationSpy = createSpyObj('InternationalizationService', ['getEnabledLanguages'])
        internationalizationSpy.getEnabledLanguages.and.returnValue(of(['en', 'pl']))

        const profileServiceSpy = createSpyObj('ProfileService', ['getOne'])
        profileServiceSpy.getOne.and.returnValue(of())

        TestBed.configureTestingModule({
            declarations: [
                CompleteComponent,
                ModalComponent,
            ],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: UserService, useValue: {}},
                {provide: ProfileService, useValue: profileServiceSpy},
                {provide: AuthService, useValue: authServiceSpy},
                {provide: InternationalizationService, useValue: internationalizationSpy},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
       expect(component).toBeTruthy();
    });
});
