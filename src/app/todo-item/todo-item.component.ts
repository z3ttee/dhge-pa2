import { Component, Input, OnInit } from '@angular/core';
import { TodoItem } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input()
  public item: TodoItem = null;

  public isExpiring: boolean = false;
  public tasksAmount: number = 0;
  public tasksDone: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.tasksAmount = this.item?.tasks?.length || 0;
    this.tasksDone = this.item?.tasks?.filter((value) => value.status == "done").length
  }

}
