
export interface TodoItemDTO {
    id?: number;
    title?: string;
    description?: string;
}
export class TodoItem implements TodoItemDTO {
    public id: number;
    public title: string;
    public description?: string;

    constructor(id: number, data: TodoItemDTO) {
        this.id = id;
        this.title = data.title;
        this.description = data.description;
    }
}