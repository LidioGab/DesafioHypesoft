using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly MongoDbContext _ctx;

    public CategoryRepository(MongoDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task AddAsync(Category category, CancellationToken ct = default)
        => await _ctx.Categories.InsertOneAsync(category, cancellationToken: ct);

    public async Task DeleteAsync(string id, CancellationToken ct = default)
        => await _ctx.Categories.DeleteOneAsync(c => c.Id == id, ct);

    public async Task<Category?> GetByIdAsync(string id, CancellationToken ct = default)
        => await _ctx.Categories.Find(c => c.Id == id).FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<Category>> ListAsync(CancellationToken ct = default)
        => await _ctx.Categories.Find(FilterDefinition<Category>.Empty).ToListAsync(ct);

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
        => await _ctx.Categories.ReplaceOneAsync(c => c.Id == category.Id, category, cancellationToken: ct);
}
