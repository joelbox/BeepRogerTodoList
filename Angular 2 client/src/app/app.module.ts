import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {Todolist} from './todolist/todolist.component';
import {Todoitemview} from './todolist/todoitemview.component';

@NgModule({
    declarations: [
        AppComponent, Todolist, Todoitemview
    ],
    imports: [
        BrowserModule, FormsModule, DragulaModule, HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
