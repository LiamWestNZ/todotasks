using TodoApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// using in-memory repository, can we swapped with DB connected repositories.
builder.Services.AddSingleton<ITodoRepository, InMemoryTodoRepository>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAngularDev");
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapDelete("/api/test/reset", async (ITodoRepository repository) =>
    {
        await repository.ClearAsync();
        return Results.NoContent();
    });
}

app.Run();

public partial class Program { }
