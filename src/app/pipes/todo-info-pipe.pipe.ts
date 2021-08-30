import { Pipe, PipeTransform } from '@angular/core';
import { TodoItem } from '../models/todo.model';

@Pipe({
  name: 'todoInfoPipe'
})
export class TodoInfoPipePipe implements PipeTransform {

  transform(value: TodoItem, ...args: unknown[]): string {
    return (value.description ? value.description : "") + (value.tasks ? " - " + value.tasks.length + " Aufgaben" : "");
  }

}
