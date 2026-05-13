import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { TodoItem } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  imports: [FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoList implements OnInit {
  private readonly todoService = inject(TodoService);

  todos = signal<TodoItem[]>([]);
  newTitle = signal('');
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAll().subscribe({
      next: todos => this.todos.set(todos),
      error: () => this.error.set('Could not load todos.')
    });
  }

  addTodo(): void {
    const title = this.newTitle().trim();
    if (!title) return;

    this.todoService.create(title).subscribe({
      next: todo => {
        this.todos.update(todos => [...todos, todo]);
        this.newTitle.set('');
        this.error.set(null);
      },
      error: () => this.error.set('Failed to add todo.')
    });
  }

  deleteTodo(id: string): void {
    this.todoService.delete(id).subscribe({
      next: () => this.todos.update(todos => todos.filter(t => t.id !== id)),
      error: () => this.error.set('Failed to delete todo.')
    });
  }
}
