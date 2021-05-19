import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import {LoginComponent} from './login.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ModalComponent} from '../../shared/modal';
import {AuthService} from '../../auth/auth.service';
import {ConfigurationService, UserService} from '../../service';
import {SSOService} from '../../service/sso.service';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';


describe('Component: Login', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(waitForAsync(() => {
        const configServiceSpy = createSpyObj('ConfigurationService', ['getConfiguration'])
        configServiceSpy.getConfiguration.and.returnValue(of({
            ssoLoginAllowed: false
        }))

        TestBed.configureTestingModule({
            declarations: [LoginComponent, ModalComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })
            ],
            providers: [
                {provide: AuthService, useValue: {}},
                {provide: ConfigurationService, useValue: configServiceSpy},
                {provide: SSOService, useValue: {}},
                {provide: UserService, useValue: {}},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    });

});
