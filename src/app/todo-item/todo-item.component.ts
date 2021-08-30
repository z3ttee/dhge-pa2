import { Component, Input, OnInit } from '@angular/core';
import { TodoItem } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input()
  public todoData: TodoItem = null;

  public isExpiring: boolean = false;
  public tasksAmount: number = 0;
  public tasksDone: number = 0;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.tasksAmount = this.todoData?.tasks?.length || 0;
    this.tasksDone = this.todoData?.tasks?.filter((value) => value.status == "done").length
  }

  public deleteItem(): void {
    this.todoService.delete(this.todoData.id);
  }

  public editItem(event: UIEvent): void {
    console.log("edit item...")
  }

}
