import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TodoItem } from '../models/todo.model';
import { Router } from '@angular/router';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoServiceReactive, TodoServiceStatic } from '../services/todo.service';

@Component({
  selector: 'app-todo-info',
  templateUrl: './todo-info.component.html',
  styleUrls: ['./todo-info.component.scss']
})
export class TodoInfoComponent implements OnInit {

  public item: TodoItem;
  public itemStatic: TodoItem;
  public currentRouteId: number = 0;
  public show404: boolean = false;
  public show404Static: boolean = false;

  constructor(
    // Use dependency injection to inject our service. 
    // This gurantees that we seperate ui and business logic.
    private todoService: TodoServiceReactive,
    private todoServiceStatic: TodoServiceStatic,

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
        // Old non reactive: this.todoData = this.todoService.findById(itemId);
        this.item = this.todoService.findById(itemId);

        if(!this.item) {
          this.show404 = true;
        } else {
          this.currentRouteId = itemId;
          this.show404 = false;
        }
        /*this.todoService.findById(itemId).subscribe((item) => {
          console.log(item)
          this.item = item;

          // This is an optional check if the todo item was found. If it does
          // not exist we show an error page of 404 Not Found.
          if(!this.item) {
            this.show404 = true;
          } else {
            this.currentRouteId = itemId;
            this.show404 = false;
          }
        })*/
    })    

    // Get the static item for visualization
    const itemId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.itemStatic = this.todoServiceStatic.findById(itemId);
    this.show404Static = !this.itemStatic;
  }

  public deleteItem() {
    this.todoService.delete(this.item.id)
    this.router.navigate(['/'])
  }

  public editItem() {
    this.openEditDialog();
  }

  public navigateNextEntry() {
    // Using linked lists here would be much more efficient

    const currentIndex = this.todoService.findIndexById(this.item.id);
    const nextItem = this.todoService.getAll()[currentIndex + 1];
    const nextId = nextItem?.id || -1;

    this.router.navigate(['/items', nextId])
  }

  public navigatePrevEntry() {
    // Using linked lists here would be much more efficient

    const currentIndex = this.todoService.findIndexById(this.item.id);
    const prevItem = this.todoService.getAll()[currentIndex - 1];
    const prevId = prevItem?.id || -1;

    this.router.navigate(['/items', prevId])
  }

  public openEditDialog() {
    const dialogRef = this.dialog.open(TodoCreateComponent, {
      width: '480px',
      data: {
        todo: {...this.item }
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.update(this.item.id, result);
      }
    });
  }

}
