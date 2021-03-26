import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DaysEventsComponent } from './days-events/days-events.component';
import { HttpClientModule } from '@angular/common/http';
import { WeeksEventsComponent } from './weeks-events/weeks-events.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TagPersonComponent } from './tag-person/tag-person.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { PersonsComponent } from './persons/persons.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminComponent } from './admin/admin.component';
import { DownloadWeekComponent } from './admin/download-week/download-week.component';




@NgModule({
  declarations: [
    AppComponent,
    DaysEventsComponent,
    WeeksEventsComponent,
    TagPersonComponent,
    PersonsComponent,
    NavbarComponent,
    AdminComponent,
    DownloadWeekComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
