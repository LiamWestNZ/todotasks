import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TodoList } from './todo-list';
import { TodoService } from '../services/todo.service';
import { TodoItem } from '../models/todo.model';

const mockTodos: TodoItem[] = [
  { id: '1', title: 'Task 1', createdAt: new Date().toISOString() },
  { id: '2', title: 'Task 2', createdAt: new Date().toISOString() }
];

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;
  let todoServiceMock: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    todoServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockTodos)),
      create: vi.fn(),
      delete: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [{ provide: TodoService, useValue: todoServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(todoServiceMock.getAll).toHaveBeenCalled();
    expect(component.todos().length).toBe(2);
  });

  it('should add a todo and clear the input', () => {
    const newTodo: TodoItem = { id: '3', title: 'Task 3', createdAt: new Date().toISOString() };
    todoServiceMock.create.mockReturnValue(of(newTodo));

    component.newTitle.set('Task 3');
    component.addTodo();

    expect(todoServiceMock.create).toHaveBeenCalledWith('Task 3');
    expect(component.todos().length).toBe(3);
    expect(component.newTitle()).toBe('');
  });

  it('should not call create when title is empty', () => {
    component.newTitle.set('   ');
    component.addTodo();

    expect(todoServiceMock.create).not.toHaveBeenCalled();
  });

  it('should delete a todo', () => {
    todoServiceMock.delete.mockReturnValue(of(undefined));

    component.deleteTodo('1');

    expect(component.todos().length).toBe(1);
    expect(component.todos()[0].id).toBe('2');
  });

  it('should set error message when loading fails', () => {
    todoServiceMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));

    component.loadTodos();

    expect(component.error()).toBeTruthy();
  });
});
