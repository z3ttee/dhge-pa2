import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TodoServiceReactive } from '../services/todo.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {

  @Input()
  public navigateToItem?: number = 0;

  constructor(private todoService: TodoServiceReactive, private router: Router) { }

  public navigateBack() {
    if(!this.navigateToItem) {
      const firstItem = this.todoService.findFirst();

      if(!firstItem) {
        this.router.navigate(["/"])
        return;
      }

      this.navigateToItem = firstItem.id;
    }

    this.router.navigate(["/items", this.navigateToItem])
  }

}
