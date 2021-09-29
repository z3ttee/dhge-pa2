import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TodoItem } from '../models/todo.model';
import { TodoServiceReactive, TodoServiceStatic } from '../services/todo.service';
import { TodoCreateComponent } from '../todo-create/todo-create.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  // Expose observable to use it in the .component.html file for data-binding
  public items$: Observable<Array<TodoItem>>;

  public itemsStatic: TodoItem[];

  constructor(public todoService: TodoServiceReactive, private todoServiceStatic: TodoServiceStatic, private dialog: MatDialog) { }

  public ngOnInit(): void {
    // Trigger fetch process
    this.todoService.findAll();

    // Store the observable of the service 
    // inside the component class
    this.items$ = this.todoService.items;

    // Load static elements from service
    this.itemsStatic = this.todoServiceStatic.findAll();
  }

  public deleteAll() {
    this.todoService.clear();
    this.todoServiceStatic.clear();
  }

  public openCreateDialog() {
    const dialogRef = this.dialog.open(TodoCreateComponent, {
      width: '480px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        result.id = this.todoService.nextIncrementedId();

        this.todoService.add(result)
        this.todoServiceStatic.add(result)
      }
    });
  }

}
