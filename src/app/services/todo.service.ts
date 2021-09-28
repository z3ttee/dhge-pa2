import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { TodoItem, TodoItemDTO } from '../models/todo.model';

const TODO_LIST_STORAGE_KEY = "todoList"
const TODO_NEXT_ID = "lastItemId"

@Injectable({
  providedIn: 'root',
})
export class TodoServiceReactive {
  // BehaviourObject to manage data changes (pushing new data etc.)
  // This is private because we only want to do changes inside the
  // service itself and not from outside. 
  private _items$ = new BehaviorSubject<Array<TodoItem>>([]);
  
  // Expose the BehaviourObject's Observable, to react on changes outside of the service.
  public readonly items: Observable<Array<TodoItem>> = this._items$.asObservable();

  constructor() {
    this.findAll();
  }

  /**
   * Fetch all items from the browser's built in localStorage asynchronously.
   * @returns Observable of Type Array of type TodoItem
   */
  public findAll(): Subscription {
    // Making an observable using of(). Observables need to be subscribed to, otherwise they
    // will never be active or even executed. So no data is fetched without subscribing to
    // an Observable.
    return of(JSON.parse(localStorage.getItem(TODO_LIST_STORAGE_KEY)) || []).subscribe((value) => {
      // Push data to the BehaviourSubject, so that all subscribers to it will be triggered.      
      this._items$.next(value);
    });
  }

  public getAll(): TodoItem[] {
    return this._items$.getValue();
  }

  /**
   * Find an element by its id
   * @param id Id of the element
   * @returns Observable of type TodoItem
   */
  public findById(id: number): TodoItem {
    return this._items$.getValue().find(((item) => item.id == id));
  }

  /**
   * Find the index of an element in the storage list.
   * @param id Id to lookup
   * @returns Number
   */
  public findIndexById(id: number): number {
    return this._items$.getValue().findIndex(((item) => item.id == id));
  }

  /**
   * Find first element in list.
   * @returns Observable of type TodoItem
   */
  public findFirst(): TodoItem {
    return this._items$.getValue()[0];
  }

  /**
   * Add new todo item.
   * @param data Item data to save
   */
  public add(data: TodoItemDTO): TodoItem {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();
    const item = new TodoItem(this.nextIncrementedId(), data);

    list.push(this.validateTodo(item));
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));

    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
    return item;
  }

  /**
   * Update existing items.
   * @param id Id of the item to be edited
   * @param data Updated data
   * @returns Instance of TodoItem
   */
  public update(id: number, data: TodoItemDTO): TodoItem {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();

    const item = list.find((value) => value.id == id);
    if(!item) return null;

    item.title = data.title;
    item.description = data.description;

    // Save updated item
    list[list.indexOf(item)] = this.validateTodo(item);
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));
    
    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
    return item;
  }

  /**
   * Delete item by its id
   * @param id Id of item to delete
   */
  public delete(id: number): void {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();

    const item = list.find((value) => value.id == id);
    if(!item) return null;

    // Delete item by setting value at index to undefined
    list.splice(list.indexOf(item), 1)
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));

    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
  }

  /**
   * Delete all items
   */
   public clear(): void {
    // Adding this line makes the 
    // application aware of the clear action
    this._items$.next([])
    localStorage.removeItem(TODO_LIST_STORAGE_KEY);
    localStorage.removeItem(TODO_NEXT_ID)
  }

  /**
   * Increment the next id by one and save it.
   * @returns Next id as number
   */
  public nextIncrementedId(): number {
    let nextId: number = Number(localStorage.getItem(TODO_NEXT_ID) || 0) ;
    ++nextId;

    localStorage.setItem(TODO_NEXT_ID, nextId.toString())
    return nextId;
  }

  /**
   * Validate an item. Creates a default title if none exists.
   * @param item Data to validate
   * @returns Instance of TodoItem
   */
  private validateTodo(item: TodoItem): TodoItem {
    if(!item.title) item.title = "Neues TODO-Element " + item.id;
    return item;
  }

}

@Injectable({
  providedIn: 'root',
})
export class TodoServiceStatic {
  // BehaviourObject to manage data changes (pushing new data etc.)
  // This is private because we only want to do changes inside the
  // service itself and not from outside. 
  private _items$ = new BehaviorSubject<Array<TodoItem>>([]);
  
  // Expose the BehaviourObject's Observable, to react on changes outside of the service.
  public readonly items: Observable<Array<TodoItem>> = this._items$.asObservable();

  constructor() {
    this.findAll();
  }

  /**
   * Fetch all items from the browser's built in localStorage asynchronously.
   * @returns Observable of Type Array of type TodoItem
   */
  public findAll(): Subscription {
    // Making an observable using of(). Observables need to be subscribed to, otherwise they
    // will never be active or even executed. So no data is fetched without subscribing to
    // an Observable.
    return of(JSON.parse(localStorage.getItem(TODO_LIST_STORAGE_KEY)) || []).subscribe((value) => {
      // Push data to the BehaviourSubject, so that all subscribers to it will be triggered.      
      this._items$.next(value);
    });
  }

  /**
   * Find an element by its id
   * @param id Id of the element
   * @returns Observable of type TodoItem
   */
  public findById(id: number): TodoItem {
    return this._items$.getValue().find(((item) => item.id == id));
  }

  /**
   * Find first element in list.
   * @returns Observable of type TodoItem
   */
  public findFirst(): TodoItem {
    return this._items$.getValue()[0];
  }

  /**
   * Add new todo item.
   * @param data Item data to save
   */
  public add(data: TodoItemDTO): TodoItem {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();
    const item = new TodoItem(this.nextIncrementedId(), data);

    list.push(this.validateTodo(item));
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));

    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
    return item;
  }

  /**
   * Update existing items.
   * @param id Id of the item to be edited
   * @param data Updated data
   * @returns Instance of TodoItem
   */
  public update(id: number, data: TodoItemDTO): TodoItem {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();

    const item = list.find((value) => value.id == id);
    if(!item) return null;

    item.title = data.title;
    item.description = data.description;

    // Save updated item
    list[list.indexOf(item)] = this.validateTodo(item);
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));
    
    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
    return item;
  }

  /**
   * Delete item by its id
   * @param id Id of item to delete
   */
  public delete(id: number): void {
    // Get current values from the behaviour subject
    const list = this._items$.getValue();

    const item = list.find((value) => value.id == id);
    if(!item) return null;

    // Delete item by setting value at index to undefined
    list.splice(list.indexOf(item), 1)
    localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(list));

    // Push changes to the behaviour subject to trigger subscribers
    this._items$.next(list);
  }

  /**
   * Delete all items
   */
   public clear(): void {
    // Adding this line makes the 
    // application aware of the clear action
    this._items$.next([])
    localStorage.removeItem(TODO_LIST_STORAGE_KEY);
    localStorage.removeItem(TODO_NEXT_ID)
  }

  /**
   * Increment the next id by one and save it.
   * @returns Next id as number
   */
  public nextIncrementedId(): number {
    let nextId: number = Number(localStorage.getItem(TODO_NEXT_ID) || 0) ;
    ++nextId;

    localStorage.setItem(TODO_NEXT_ID, nextId.toString())
    return nextId;
  }

  /**
   * Validate an item. Creates a default title if none exists.
   * @param item Data to validate
   * @returns Instance of TodoItem
   */
  private validateTodo(item: TodoItem): TodoItem {
    if(!item.title) item.title = "Neues TODO-Element " + item.id;
    return item;
  }

}

