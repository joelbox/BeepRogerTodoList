<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Request;

class BeepRogerController extends Controller {

    public function select(){
        $data = DB::select('select * from BeepRogerTodoList');
        foreach($data as $item){
            switch($item->done){
                case "0":
                    $item->done = False;
                    break;
                case "1":
                    $item->done = True;
                    break;
                default:
                    throw "Error database not understood";
                    break;
            }
        }
        return $data;
    }

    public function insert() {
        $todolist = Request::all();
        DB::statement("TRUNCATE TABLE BeepRogerTodoList");
        foreach ($todolist as $item) {
            $done = 1;
            if (empty($item["done"])) $done = 0;
            DB::insert('insert into BeepRogerTodoList (item,done) values(:item, :done)', [":item" => $item["item"], ":done" => $done]);
        }
    }

}