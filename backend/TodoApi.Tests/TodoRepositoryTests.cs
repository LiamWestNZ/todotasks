using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Tests;

public class TodoRepositoryTests
{
    private readonly InMemoryTodoRepository _repository = new();

    [Fact]
    public async Task AddAsync_StoresAndReturnsItem()
    {
        var item = new TodoItem { Id = Guid.NewGuid(), Title = "Buy milk", CreatedAt = DateTime.UtcNow };

        var result = await _repository.AddAsync(item);

        Assert.Equal(item.Id, result.Id);
        Assert.Equal("Buy milk", result.Title);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllItems()
    {
        await _repository.AddAsync(new TodoItem { Id = Guid.NewGuid(), Title = "Task 1", CreatedAt = DateTime.UtcNow });
        await _repository.AddAsync(new TodoItem { Id = Guid.NewGuid(), Title = "Task 2", CreatedAt = DateTime.UtcNow });

        var items = await _repository.GetAllAsync();

        Assert.Equal(2, items.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectItem()
    {
        var item = new TodoItem { Id = Guid.NewGuid(), Title = "Find me", CreatedAt = DateTime.UtcNow };
        await _repository.AddAsync(item);

        var result = await _repository.GetByIdAsync(item.Id);

        Assert.NotNull(result);
        Assert.Equal("Find me", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesItem()
    {
        var item = new TodoItem { Id = Guid.NewGuid(), Title = "Delete me", CreatedAt = DateTime.UtcNow };
        await _repository.AddAsync(item);

        var deleted = await _repository.DeleteAsync(item.Id);

        Assert.True(deleted);
        Assert.Null(await _repository.GetByIdAsync(item.Id));
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        var deleted = await _repository.DeleteAsync(Guid.NewGuid());

        Assert.False(deleted);
    }
}
