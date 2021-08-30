import { Injectable } from '@angular/core';
import { TodoItem, TodoItemDTO } from '../models/todo.model';

const TODO_LIST_STORAGE_KEY = "todoList"
const TODO_NEXT_ID = "lastItemId"

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

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
  public findById(id: number): TodoItem {
    return this.findAll().find((todo) => todo.id == id);
  }

  /**
   * Delete item by id
   * @param id Id of item to delete
   */
  public delete(id: number): void {
    const todos = this.findAll();
    const todo = this.findById(id);
    
    todos.splice(todos.indexOf(todo), 1);
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todos));
  }

  /**
   * Delete all items
   */
  public clear(): void {
    localStorage.removeItem(TODO_LIST_STORAGE_KEY);
    localStorage.removeItem(TODO_NEXT_ID)
  }

  /**
   * Add item
   * @param item Item to add
   * @returns TodoItem object
   */
  public add(item: TodoItemDTO): TodoItem {
    const todos = this.findAll();
    const todo = new TodoItem(this.nextIncrementedId(), item);

    todos.push(this.validateTodo(todo));
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todos));

    return todo;
  }

  /**
   * Update item by its id
   * @param id Id to search for
   * @param item Updated item data
   * @returns 
   */
  public update(id: number, item: TodoItemDTO): TodoItem {
    const todos = this.findAll();
    const todo = this.findById(id);
    if(!todo) return null;

    const oldTodoIndex = todos.findIndex((value) => value.id == id)

    todo.title = item.title;
    todo.description = item.description;
    todo.deadline = item.deadline;
    todo.tasks = item.tasks;

    todos[oldTodoIndex] = this.validateTodo(todo);
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todos));
    return todo;
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
