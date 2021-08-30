import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { TodoCreateComponent } from '../todo-create/todo-create.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todos: TodoItem[];
  todosDeadlined: TodoItem[];
  otherTodos: TodoItem[];

  constructor(private todoService: TodoService, private dialog: MatDialog) { }

  public ngOnInit(): void {
    this.todos = this.todoService.findAll();

    this.todosDeadlined = this.todos.filter((todo) => todo.deadline);
    this.otherTodos = this.todos.filter((todo) => !todo.deadline);
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
