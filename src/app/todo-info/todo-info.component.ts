import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TodoItem } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-info',
  templateUrl: './todo-info.component.html',
  styleUrls: ['./todo-info.component.scss']
})
export class TodoInfoComponent implements OnInit {

  public todoData: TodoItem = null;
  public currentRouteId: number = 0;
  public show404: boolean = false;

  constructor(
    // Use dependency injection to inject our service. 
    // This gurantees that we seperate ui and business logic.
    private todoService: TodoService,

    // We need to read the TODO Item ID from the route, so we have to inject
    // the currently activated route
    private route: ActivatedRoute,

    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Subscribe to paramMap instead of using route snapshot.
    // The snapshot is an image of the values as of right now. So it is a static value.
    // To have the page stay up to data we have to subscribe to changes on the route's parameters.
    // Using a subscriber we can listen to those changes and make changes ourselves to show the correct item.
    this.route.paramMap.subscribe((params: ParamMap) => {
        const itemId = parseInt(params.get("id"));

        // Here we use our injected service to fetch a todo 
        // item from the list that matches the given id
        this.todoData = this.todoService.findById(itemId);

        // This is an optional check if the todo item was found. If it does
        // not exist we show an error page of 404 Not Found.
        if(!this.todoData) {
          this.show404 = true;
        } else {
          this.currentRouteId = itemId;
          this.show404 = false;
        }
    })    
  }

  public deleteItem() {
    this.todoService.delete(this.todoData.id)   
    this.router.navigate(['/'])
  }

  public editItem() {
    this.openEditDialog();
  }

  public openEditDialog() {
    const dialogRef = this.dialog.open(TodoCreateComponent, {
      width: '480px',
      data: {
        todo: {...this.todoData}
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.update(this.todoData.id, result)
      }
    });
  }

}
