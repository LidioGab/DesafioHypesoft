using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _ctx;

    public ProductRepository(MongoDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
        => await _ctx.Products.InsertOneAsync(product, cancellationToken: ct);

    public async Task DeleteAsync(string id, CancellationToken ct = default)
        => await _ctx.Products.DeleteOneAsync(p => p.Id == id, ct);

    public async Task<Product?> GetByIdAsync(string id, CancellationToken ct = default)
        => await _ctx.Products.Find(p => p.Id == id).FirstOrDefaultAsync(ct);

    public async Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(string? search, string? categoryId, int page, int pageSize, CancellationToken ct = default)
    {
        var filterBuilder = Builders<Product>.Filter;
        var filters = new List<FilterDefinition<Product>>();
        if (!string.IsNullOrWhiteSpace(search))
            filters.Add(filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")));
        if (!string.IsNullOrWhiteSpace(categoryId))
            filters.Add(filterBuilder.Eq(p => p.CategoryId, categoryId));
        var filter = filters.Count > 0 ? filterBuilder.And(filters) : FilterDefinition<Product>.Empty;

        var total = await _ctx.Products.CountDocumentsAsync(filter, cancellationToken: ct);
        var items = await _ctx.Products.Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
        return (items, total);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        product.UpdatedAt = DateTime.UtcNow;
        await _ctx.Products.ReplaceOneAsync(p => p.Id == product.Id, product, cancellationToken: ct);
    }

    public async Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold = 10, CancellationToken ct = default)
        => await _ctx.Products.Find(p => p.StockQuantity < threshold).ToListAsync(ct);

    public async Task<decimal> GetTotalInventoryValueAsync(CancellationToken ct = default)
    {
        var pipeline = new BsonDocument[]
        {
            new("$group", new BsonDocument
            {
                {"_id", BsonNull.Value},
                {"total", new BsonDocument("$sum", new BsonDocument("$multiply", new BsonArray {"$Price", "$StockQuantity"}))}
            })
        };
        var result = await _ctx.Products.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync(ct);
        return result != null && result.Contains("total") ? result["total"].ToDecimal() : 0m;
    }

    public async Task<IDictionary<string, int>> GetProductsByCategoryAsync(CancellationToken ct = default)
    {
        var pipeline = new BsonDocument[]
        {
            new("$group", new BsonDocument
            {
                {"_id", "$CategoryId"},
                {"count", new BsonDocument("$sum", 1)}
            })
        };
        var results = await _ctx.Products.Aggregate<BsonDocument>(pipeline).ToListAsync(ct);
        return results.ToDictionary(d => d["_id"].AsString, d => d["count"].ToInt32());
    }
}
