using System.Collections.Concurrent;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();

    public Task<IEnumerable<TodoItem>> GetAllAsync() =>
        Task.FromResult(_items.Values.OrderBy(t => t.CreatedAt).AsEnumerable());

    public Task<TodoItem?> GetByIdAsync(Guid id) =>
        Task.FromResult(_items.TryGetValue(id, out var item) ? item : null);

    public Task<TodoItem> AddAsync(TodoItem item)
    {
        _items.TryAdd(item.Id, item);
        return Task.FromResult(item);
    }

    public Task<bool> DeleteAsync(Guid id) =>
        Task.FromResult(_items.TryRemove(id, out _));

    public Task ClearAsync()
    {
        _items.Clear();
        return Task.CompletedTask;
    }
}
