import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoItemDTO } from '../models/todo.model';

export interface DialogData {
  todo?: TodoItemDTO
}

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent implements OnInit {

  public todo: TodoItemDTO = {};

  constructor(
    public dialogRef: MatDialogRef<TodoCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    if(this.data.todo) {
      this.todo = this.data.todo;
    }
  }

  public onDismiss() {
    this.dialogRef.close();
  }

}
