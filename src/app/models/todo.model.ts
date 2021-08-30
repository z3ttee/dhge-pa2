
export interface TodoItemDTO {
    title?: string;
    description?: string;
    deadline?: Date;
    tasks?: any[];
}
export class TodoItem implements TodoItemDTO {
    public id: number;
    public title: string;
    public description?: string;
    public deadline?: Date;
    public tasks?: any[];

    constructor(id: number, data: TodoItemDTO) {
        this.id = id;
        this.title = data.title;
        this.description = data.description;
        this.deadline = data.deadline;
        this.tasks = data.tasks;
    }
}