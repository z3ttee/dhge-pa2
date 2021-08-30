import { Component, Input, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  @Input()
  public lastItemId: number = -1;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    if(this.lastItemId == -1) {
      this.lastItemId = this.todoService.findAll()[0].id
    }
  }

}
