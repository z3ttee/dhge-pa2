import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TodoItem } from '../models/todo.model';
import { TodoServiceReactive } from '../services/todo.service';
import { TodoCreateComponent } from '../todo-create/todo-create.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  // Expose observable to use it in the .component.html file for data-binding
  public items$: Observable<Array<TodoItem>>;
  
  todosDeadlined: TodoItem[];
  otherTodos: TodoItem[];

  constructor(public todoService: TodoServiceReactive, private dialog: MatDialog) { }

  public ngOnInit(): void {
    // Trigger fetch process
    this.todoService.findAll();

    // Store the observable of the service 
    // inside the component class
    this.items$ = this.todoService.items;

    // this.todosDeadlined = this.todos.filter((todo) => todo.deadline);
    // this.otherTodos = this.todos.filter((todo) => !todo.deadline);
  }

  public deleteAll() {
    this.todoService.clear();
  }

  public openCreateDialog() {
    const dialogRef = this.dialog.open(TodoCreateComponent, {
      width: '480px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.add(result)
      }
    });
  }

}
