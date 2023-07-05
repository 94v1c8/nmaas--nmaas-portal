import {RegistrationService} from '../../auth/registration.service';
import {Domain} from '../../model/domain';
import {Registration} from '../../model/registration';
import {AppConfigService} from '../../service/appconfig.service';
import {PasswordValidator} from '../../shared/common/password/password.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {ModalInfoTermsComponent} from '../../shared/modal/modal-info-terms/modal-info-terms.component';
import {ModalInfoPolicyComponent} from '../../shared/modal/modal-info-policy/modal-info-policy.component';
import {ModalComponent} from '../../shared/modal';

import {PasswordStrengthMeterComponent} from 'angular-password-strength-meter';
import {TranslateService} from '@ngx-translate/core';
import {catchError, map} from 'rxjs/operators';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {ConfigurationService} from '../../service';

@Component({
  selector: 'nmaas-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
    providers: [ModalComponent, ModalInfoTermsComponent, ModalInfoPolicyComponent]
})
export class RegistrationComponent implements OnInit {


  public sending = false;
  public submitted = false;
  public success = false;
  public errorMessage = '';

  @ViewChild(PasswordStrengthMeterComponent, { static: true })
  passwordMeter: PasswordStrengthMeterComponent;

  @ViewChild(ModalComponent, { static: true })
  public readonly  modal: ModalComponent;

  @ViewChild(ModalInfoTermsComponent, { static: true })
  public readonly modalInfoTerms: ModalInfoTermsComponent;

  @ViewChild(ModalInfoPolicyComponent, { static: true })
  public readonly modalInfoPolicy: ModalInfoPolicyComponent;

  public registrationForm: UntypedFormGroup;
  public domains: Observable<Domain[]>;
  public showDomainsSelector = true;

  private readonly language: string = '';

  constructor(private fb: UntypedFormBuilder,
              private registrationService: RegistrationService,
              private appConfig: AppConfigService,
              private translate: TranslateService,
              private recaptchaV3Service: ReCaptchaV3Service,
              private configurationService: ConfigurationService) {
    this.registrationForm = fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        firstname: [''],
        lastname: [''],
        domainId: [null],
          termsOfUseAccepted: [true],
          privacyPolicyAccepted: [false],
      },
      {
        validator: PasswordValidator.match
      });

  }

  ngOnInit() {
    this.modal.setModalType('info');
    this.domains = this.registrationService.getDomains().pipe(
        map((domains) => domains.filter((domain) => domain.id !== this.appConfig.getNmaasGlobalDomainId())));
    this.configurationService.getConfiguration().subscribe( configuration => {
        this.showDomainsSelector = configuration.registrationDomainSelectionEnabled;
    })
  }

  public onSubmit(): void {
      this.recaptchaV3Service.execute('registration').pipe(
          catchError(_ => of('')), // in case of captcha error return empty token
      ).subscribe((captchaToken) => {
          if (!this.registrationForm.controls['termsOfUseAccepted'].value
              || !this.registrationForm.controls['privacyPolicyAccepted'].value) {
              this.sending = false;
              this.submitted = true;
              this.success = false;
              this.errorMessage = this.translate.instant('GENERIC_MESSAGE.TERMS_OF_USER_MESSAGE');
          } else {
              if (this.registrationForm.valid) {
                  this.sending = true;
                  const registration: Registration = new Registration(
                      this.registrationForm.controls['username'].value,
                      this.registrationForm.controls['newPassword'].value,
                      this.registrationForm.controls['email'].value,
                      this.registrationForm.controls['firstname'].value,
                      this.registrationForm.controls['lastname'].value,
                      this.registrationForm.controls['domainId'].value,
                      true,
                      this.registrationForm.controls['privacyPolicyAccepted'].value,
                  );
                  this.registrationService.register(registration, captchaToken).subscribe(
                      (result) => {
                          this.registrationForm.reset();
                          this.sending = false;
                          this.submitted = true;
                          this.success = true;
                          this.modal.show();
                      },
                      (err) => {
                          this.sending = false;
                          this.submitted = true;
                          this.success = false;
                          this.errorMessage = this.translate.instant(this.getMessage(err));
                      },
                      () => {
                          this.sending = false;
                          this.submitted = true;
                      }
                  );

              }
          }
      });

  }

  public refresh(): void {
    this.sending = false;
    this.submitted = false;
    this.success = false;
    this.errorMessage = '';
  }

  private getMessage(err: any): string {
      return err['message'] === 'Domain not found' ? 'REGISTRATION.DOMAIN_NOT_FOUND_MESSAGE' : err['message'] === 'Captcha validation has failed' ? 'GENERIC_MESSAGE.NOT_ROBOT_ERROR_MESSAGE' : err['message'] === 'User already exists' ? 'REGISTRATION.USER_ALREADY_EXISTS_MESSAGE' : err['status'] === 406 ? 'REGISTRATION.INVALID_INPUT_DATA' : 'GENERIC_MESSAGE.UNAVAILABLE_MESSAGE';
  }
}
