import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TermsAcceptanceComponent} from './terms-acceptance.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../service';
import {AuthService} from '../../auth/auth.service';
import {ModalComponent} from '../../shared/modal';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TermsAcceptanceComponent', () => {
    let component: TermsAcceptanceComponent;
    let fixture: ComponentFixture<TermsAcceptanceComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TermsAcceptanceComponent, ModalComponent],
            imports: [
                RouterTestingModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: UserService, useValue: {}},
                {provide: AuthService, useValue: {}}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TermsAcceptanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
