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

  constructor(private todoService: TodoService, private dialog: MatDialog) { 
    this.todos = this.todoService.findAll();
  }

  ngOnInit(): void {
  }

  public openCreateDialog() {
    const dialogRef = this.dialog.open(TodoCreateComponent, {
      width: '480px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.todoService.add(result)
    });
  }

}
