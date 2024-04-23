import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SshKeysComponent} from './ssh-keys.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SSHKeyService} from '../../../service/sshkey.service';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SshKeysComponent', () => {
    let component: SshKeysComponent;
    let fixture: ComponentFixture<SshKeysComponent>;

    let sshKeyServiceSpy = undefined

    beforeEach(waitForAsync(() => {
        sshKeyServiceSpy = createSpyObj('SSHKeyService', ['getAll', 'invalidate'])
        sshKeyServiceSpy.invalidate.and.returnValue(of(true))
        sshKeyServiceSpy.getAll.and.returnValue(of([
            {id: 1, name: 'key-1', fingerprint: 'fingerprint'},
            {id: 2, name: 'key-2', fingerprint: 'fingerprint'},
        ]))

        TestBed.configureTestingModule({
            declarations: [SshKeysComponent],
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: SSHKeyService, useValue: sshKeyServiceSpy}
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SshKeysComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call SSHKeyService method to invalidate', () => {
        component.invalidate(1);
        expect(sshKeyServiceSpy.invalidate).toHaveBeenCalledTimes(1)
    });
});
