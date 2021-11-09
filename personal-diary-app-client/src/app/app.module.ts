import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { PersonalDiariesComponent } from './components/personal-diaries/personal-diaries.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SecureInterceptor } from './services/secure.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
import { CreateDiaryEntryComponent } from './components/create-diary-entry/create-diary-entry.component';
import { FormsModule } from '@angular/forms';
import { UploadDiaryItemAttachmentComponent } from './components/upload-diary-item-attachment/upload-diary-item-attachment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PersonalDiariesComponent,
    LoaderComponent,
    CreateDiaryEntryComponent,
    UploadDiaryItemAttachmentComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        AuthModule.forRoot({
            domain: environment.authConfig.domain,
            clientId: environment.authConfig.clientId,
            // httpInterceptor: {
            //   allowedList: [
            //     `${environment.apiEndpoint}/diary-entries`,
            //     `${environment.apiEndpoint}/diary-entries/*`,
            //     `${environment.apiEndpoint}/diary-entries/*/attachment`
            //   ]
            // }
        }),
        FormsModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureInterceptor,
      multi: true,
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthHttpInterceptor,
    //   multi: true,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
