import { Component, Input } from '@angular/core';
import { TodoItem } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input()
  public item: TodoItem = null;

  constructor() { }

}
