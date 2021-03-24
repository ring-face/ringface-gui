import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeksEventsComponent } from './weeks-events/weeks-events.component';
import { RouterModule, Routes } from '@angular/router';
import { PersonsComponent } from './persons/persons.component';

const routes: Routes = [
  { path: 'week-events', component: WeeksEventsComponent },
  { path: 'persons', component: PersonsComponent },
  { path: '', redirectTo: '/week-events', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
