import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { TodoItem } from '../models/todo.model';

const mockTodo: TodoItem = { id: '1', title: 'Test task', createdAt: new Date().toISOString() };

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should send GET request and return todos', () => {
    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Test task');
    });

    httpMock.expectOne(req => req.url.includes('/api/todos') && req.method === 'GET').flush([mockTodo]);
  });

  it('create should send POST request with title', () => {
    service.create('New task').subscribe(todo => {
      expect(todo.title).toBe('Test task');
    });

    const req = httpMock.expectOne(req => req.url.includes('/api/todos') && req.method === 'POST');
    expect(req.request.body).toEqual({ title: 'New task' });
    req.flush(mockTodo);
  });

  it('delete should send DELETE request with id', () => {
    service.delete('1').subscribe();

    httpMock.expectOne(req => req.url.includes('/api/todos/1') && req.method === 'DELETE').flush(null);
  });
});
