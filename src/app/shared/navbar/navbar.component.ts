import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {interval, Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {DomainService} from '../../service';
import {InternationalizationService} from '../../service/internationalization.service';
import {ModalNotificationSendComponent} from '../modal/modal-notification-send/modal-notification-send.component';
import {DatePipe} from '@angular/common';
import {UserDataService} from '../../service/userdata.service';
import {ServiceUnavailableService} from '../../service-unavailable/service-unavailable.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @ViewChild(ModalNotificationSendComponent, {static: true})
    public notificationModal;

    public languages: string[];
    public refresh: Subscription;
    public isServiceAvailable: boolean;

    public time: string;
    private intervalId: any;
    public showClock = false;

    public autoLogout = false;


    constructor(public router: Router,
                public authService: AuthService,
                private translate: TranslateService,
                private datePipe: DatePipe,
                private languageService: InternationalizationService,
                private domainService: DomainService,
                private userDataService: UserDataService,
                private serviceAvailability: ServiceUnavailableService) {
    }

    useLanguage(language: string) {
        this.translate.use(language);
    }

    getCurrent() {
        return this.translate.currentLang;
    }

    getPathToCurrent() {
        return 'assets/images/country/' + this.getCurrent() + '_circle.png';
    }

    ngOnInit() {
        this.isServiceAvailable = this.serviceAvailability.isServiceAvailable;
        this.getSupportedLanguages();
        if (this.authService.isLogged()) {
            if (this.authService.hasRole('ROLE_SYSTEM_ADMIN')) {
                this.refresh = interval(5000).subscribe(next => {
                    if (this.languageService.shouldUpdate()) {
                        this.getSupportedLanguages();
                        this.languageService.setUpdateRequiredFlag(false);
                    }
                });
            }
        }
        this.intervalId = setInterval(() => {
            if (this.authService.isLogged()) {
                const expiredTimeText: string = localStorage.getItem('_expiredTime')
                if (parseInt(expiredTimeText, 10) > Date.now()) {
                    this.time = this.datePipe.transform(new Date(parseInt(expiredTimeText, 10) - Date.now()), 'mm:ss')
                }
                this.showClock = parseInt(expiredTimeText, 10) - Date.now() < 180000 && parseInt(expiredTimeText, 10) - Date.now() >= 0;
                if (this.showClock) {
                    console.log('Autologout in ', this.time);
                }
            }
        }, 1000);
    }

    public getSupportedLanguages() {
        this.languageService.getEnabledLanguages().subscribe(langs => {
            this.translate.addLangs(langs);
            this.languages = langs;
        });
    }

    public checkUserRole(): boolean {
        return this.authService.getDomains().filter(value => value !== this.domainService.getGlobalDomainId()).length > 0
            || this.authService.getRoles().filter(value => value !== 'ROLE_INCOMPLETE')
                .filter(value => value !== 'ROLE_GUEST')
                .length > 0;
    }

    public showNotificationModal(): void {
        this.notificationModal.show();
    }

    public isOnlyGuestInGlobalDomain(): boolean {
        const globalDomainRoles = this.authService.getDomainRoles().get(this.domainService.getGlobalDomainId()).getRoles()
        return globalDomainRoles  // does have any role in global domain (not undefined)
            && globalDomainRoles.length === 1  // only one role in global domain
            && globalDomainRoles[0] === 'ROLE_GUEST'  // this single role is ROLE_GUEST
            && this.authService.getDomains().length === 1 // no roles in other domains
    }

    public shouldDisplaySubscriptions() {
        let currentDomainId = undefined;
        const globalDomainId = this.domainService.getGlobalDomainId();
        this.userDataService.selectedDomainId.subscribe(id => currentDomainId = id)
        const isGlobal = currentDomainId === globalDomainId
        const isSystemAdmin = this.authService.hasDomainRole(globalDomainId, 'ROLE_SYSTEM_ADMIN')
        return !isGlobal ? true : isSystemAdmin
    }
}
