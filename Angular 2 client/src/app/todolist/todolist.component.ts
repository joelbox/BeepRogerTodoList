import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Todo item consists of a string and boolean.
 */
interface Todoitem {
    item: string;
    done: boolean;
}

/**
 * Pairing of item and index in array.
 */
interface SelectedTodoitem {
    item: Todoitem,
    index: number
}

@Component({
    selector: 'todolist',
    templateUrl: './todolist.component.html',
    styleUrls: ['./todolist.component.css'],
    viewProviders: [DragulaService]
})
export class Todolist implements OnInit {
    public _todolist: Todoitem[] = null;
    public set todolist(list: Todoitem[]) {
        // Check for empty strings, dont save if empty strings
        let fail: boolean = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].item == null || list[i].item.trim().length == 0) {
                fail = true;
                break;
            }
        }
        if (!fail) this._todolist = list;
    }

    public get todolist(): Todoitem[] {
        return this._todolist;
    }

    /**
     * <input> variable used in addNewItem()
     */
    public newItem: string;

    /**
     * When the user clicked an item in the todolist that item will highlight and show its details.
     * Selected items are shown over highlighted items.
     *
     * @type {any}
     */
    public selectedItem: SelectedTodoitem = null;

    /**
     * When the user hovers over an item in the todolist that item will highlight and show its details.
     * Selected items are shown over highlighted items.
     * @type {SelectedTodoitem}
     */
    public hoveredItem: SelectedTodoitem = null;

    /**
     * Info help screen toggle.
     */
    public showInfo: boolean = true;

    public postSuccessful: boolean = false;
    public loading:number = 0;

    constructor(private dragulaService: DragulaService,
                private http: Http) {
        // Dragula
        dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value.slice(1));
        });
        dragulaService.removeModel.subscribe((value) => {
            this.onRemoveModel(value.slice(1));
        });
        dragulaService.setOptions('bag', {
            moves: function (el, container, handle) {
                return handle.className.indexOf('dragHandle') != -1;
            }
        });


        this.defaultTodolist();
    }

    ngOnInit() {
        this.load();
    }

    /**
     * Get request to server.
     */
    public load() {
        this.loading++;
        this.http
            .get('http://roburbox.nl/api/todolist')
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    data.forEach(item => {
                        if (typeof item.done === "string") throw "Response json contains strings instead of booleans";
                    });
                    this.selectedItem = null;
                    this.todolist = data;
                },
                error => {
                    this.loading--;
                    console.log(error);
                    throw error;
                },
                () => {
                    // Success
                    this.loading--;
                }
            );
    }

    /**
     * Post using Content-Type:application/x-www-form-urlencoded
     */
    public postUrlEncoded() {
        this.postSuccessful = false;
        this.http.post(
            "http://roburbox.nl/api/todolist",
            encodeURI(JSON.stringify(this.todolist)),
            new RequestOptions({
                headers: new Headers({"Content-Type": "application/x-www-form-urlencoded"})
            })
        ).subscribe(
            data => {
            },
            error => {
                throw error;
            },
            () => {
                this.postSuccessful = true;
            }
        );
    }

    /**
     * Post using JSON
     */
    public post() {
        let body = this.todolist;
        for (let i = 0; i < body.length; i++) {
            if (body[i].item == undefined || body[i].item.trim().length == 0) {
                body.splice(i, 1);
            }
        }
        this.postSuccessful = false;
        this.loading++;
        this.http.post(
            "http://roburbox.nl/api/todolist",
            JSON.stringify(body),
            new RequestOptions({
                headers: new Headers({"Content-Type": "application/json"})
            })
        ).subscribe(
            data => {
            },
            error => {
                this.loading--;
                throw error;
            },
            () => {
                this.postSuccessful = true;
                this.loading--;
            }
        );
    }

    /**
     * Dragula interface: applying the drag and drop change to todolist
     */
    private onDropModel(args) {
        let [el, target, source] = args;
        // Update selectedItem index
        if (this.selectedItem != null) {
            for (let i = 0; i < this.todolist.length; i++) {
                if (this.todolist[i] === this.selectedItem.item) this.selectedItem.index = i;
            }
        }
    }

    /**
     * Dragula interface
     */
    private onRemoveModel(args) {
        let [el, source] = args;
    }

    /**
     * <input> new item
     */
    public addNewItem() {
        this.todolist = [{item: this.newItem, done: false}].concat(this.todolist);
        this.selectedItem = {item: this.todolist[0], index: 0};
        this.newItem = null;
    }

    /**
     * Request data from server and returns obervable.
     * @returns Observable<Todoitem[]>;
     */
    public defaultTodolist() {
        this.todolist = [
            {item: "appels", done: false},
            {item: "bananen", done: true},
            {item: "boter", done: true},
            {item: "brood", done: false},
            {item: "cornflakes", done: false},
            {item: "eieren", done: false},
            {item: "hagelslag", done: false},
            {item: "jam", done: false},
            {item: "kaas", done: false},
            {item: "melk", done: false},
            {item: "peren", done: false}
        ];
    }

    /**
     * Handles return value from detail page.
     * @param event
     */
    public handleChange(event: any) {
        switch (event.action) {
            case "delete":
                this.remove(event.index);
                this.selectedItem = null;
                break;
            case "close":
                this.selectedItem = null;
                break;
            default:
                throw "Todoitem event not understood";
        }
    }

    /**
     * User overed over an item.
     * @param {Todoitem} item
     * @param {number} idx
     */
    public hoverItem(item: Todoitem, idx: number) {
        this.hoveredItem = {
            item: item,
            index: idx
        }
    }

    /**
     * Remove hover highlight when mouse left todolist.
     * Otherwise the last item will stay highlighted.
     */
    public removeHoverItem() {
        this.hoveredItem = null;
    }

    /**
     * User clicked on an item:
     * If nothing selected then select this item.
     * If this item is already selected then deselect.
     * If another item is selected then select this item.
     * @param {Todoitem} item
     * @param {number} idx
     */
    public clickItem(item: Todoitem, idx: number) {
        if (this.selectedItem) {
            if (this.selectedItem.index === idx) {
                // Deselect
                this.selectedItem = null;
            } else {
                // Select another item
                this.selectedItem = {
                    item: item,
                    index: idx
                }
            }
        } else {
            // Select new item
            this.selectedItem = {
                item: item,
                index: idx
            }
        }
    }

    /**
     * Remove button deletes the item from todolist.
     * @param {number} idx index in array.
     */
    public remove(idx: number) {
        this.todolist.splice(idx, 1);
    }
}
