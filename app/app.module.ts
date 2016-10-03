import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {FormsModule} from "@angular/forms";
import {ImagesService} from "./images.service";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent],
  providers:[ImagesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
