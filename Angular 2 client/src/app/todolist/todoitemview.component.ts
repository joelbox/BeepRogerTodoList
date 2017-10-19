import {Component, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';

interface Todoitem {
    item: string;
    done: boolean;
}

@Component({
    selector: 'todoitemview',
    templateUrl: './todoitemview.component.html',
    styleUrls: ['./todoitemview.component.css']
})
export class Todoitemview {

    /**
     * The todoitem to be shown in this detail view.
     */
    @Input()
    set todoitem(item:Todoitem) {
        this._todoitem = item;
        this._newItem = item.item; // Dont target setter; otherwise it loops
    }
    get todoitem():Todoitem {
        return this._todoitem;
    }
    private _todoitem:Todoitem;

    @Input()
    index:number;

    /**
     * EventEmitter that communicates the resulting Todoitem if it changed.
     * @type {EventEmitter<any>}
     */
    @Output()
    output = new EventEmitter();

    /**
     * <input> ngModel.
     * Emits change on setter.
     * If changed from outside <input> then dont use setter.
     */
    private _newItem:string;
    private get newItem():string {
        return this._newItem;
    }

    private set newItem(item:string) {
        this._newItem = item;
        this.todoitem.item = item;
    }


    private delete(idx:number){
        this.output.emit({action:"delete", index:idx});
    }

    private close(){
        this.output.emit({action:"close"});
    }

    /**
     * Prevent empty input
     */
    private validateInput(){
        if(this.newItem.trim().length == 0) this.newItem = "?";
    }


}
