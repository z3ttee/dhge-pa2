import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoInfoComponent } from './todo-info/todo-info.component';
import { TodoListComponent } from './todo-list/todo-list.component';

const routes: Routes = [
  {
    path: "",
    component: TodoListComponent
  },
  {
    path: "items",
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path: "items/:id",
    component: TodoInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
