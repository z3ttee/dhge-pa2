import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TodoItem, TodoItemDTO } from '../models/todo.model';
import { filter, first, map } from "rxjs/operators"

const TODO_LIST_STORAGE_KEY = "todoList"
const TODO_NEXT_ID = "lastItemId"

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private _todosBehaviourSubj: BehaviorSubject<TodoItem[]> = new BehaviorSubject([])
  public readonly todos: Observable<TodoItem[]> = this._todosBehaviourSubj.asObservable();

  constructor() { 
    // Initially load the data into the behaviour subject
    this._todosBehaviourSubj.next(this.findAll())
  }

  /**
   * Find all items
   * @returns Array of TodoItems
   */
  public findAll(): TodoItem[] {
    return JSON.parse(localStorage.getItem(TODO_LIST_STORAGE_KEY) || "[]") as TodoItem[]
  }

  /**
   * Find an item by its id
   * @param id Id to search for
   * @returns TodoItem object
   */
  public findById(id: number): Observable<TodoItem> {
    /* This is how it looked before making 
       the add() function reactive

        return this.findAll().find((todo) => todo.id == id);
    */

    return this._todosBehaviourSubj.pipe(
      map((todos) => todos.find((todo) => todo.id == id))
    );
  }

  /**
   * Delete item by id
   * @param id Id of item to delete
   */
  public delete(id: number): void {
    const todos = this.findAll();
    const todo = this.findById(id);
    
    // todos.splice(todos.indexOf(todo), 1);
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todos));
  }

  /**
   * Delete all items
   */
  public clear(): void {
    // Adding this line makes the 
    // application aware of the clear action
    this._todosBehaviourSubj.next([])

    localStorage.removeItem(TODO_LIST_STORAGE_KEY);
    localStorage.removeItem(TODO_NEXT_ID)
  }

  /**
   * Add item
   * @param item Item to add
   * @returns TodoItem object
   */
  public add(item: TodoItemDTO): TodoItem {
    /* This is how it looked before making 
       the add() function reactive

        const todos = this.findAll();
        const todo = new TodoItem(this.nextIncrementedId(), item);

        todos.push(this.validateTodo(todo));
        localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todos));

        return todo;
    */

    // Reactive solution:
    const todo = new TodoItem(this.nextIncrementedId(), item);

    this._todosBehaviourSubj.next([ ...this._todosBehaviourSubj.getValue(), this.validateTodo(todo) ])
    this.todos.subscribe((list) => {
      localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));
    })

    return todo;
  }

  /**
   * Update item by its id
   * @param id Id to search for
   * @param item Updated item data
   * @returns 
   */
  public update(id: number, item: TodoItemDTO) {
    this.findById(id).subscribe((todo) => {
      console.log("updating...", todo)
      const todoList = this._todosBehaviourSubj.getValue();
      console.log("updating...", todoList)
      if(!todo) return null;

      const oldTodoIndex = todoList.findIndex((value) => value.id == id)
  
      todo.title = item.title;
      todo.description = item.description;
      todo.deadline = item.deadline;
      todo.tasks = item.tasks;
  
      todoList[oldTodoIndex] = this.validateTodo(todo);
      localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todoList));
    })
  }

  /**
   * Increment the next id by one and save it.
   * @returns Next id as number
   */
  public nextIncrementedId(): number {
    let nextId: number = Number(localStorage.getItem(TODO_NEXT_ID) || -1) ;
    ++nextId;

    localStorage.setItem(TODO_NEXT_ID, nextId.toString())
    return nextId;
  }

  private validateTodo(item: TodoItem): TodoItem {
    if(!item.title) item.title = "Neues TODO-Element " + (item.id + 1);
    return item;
  }
}
