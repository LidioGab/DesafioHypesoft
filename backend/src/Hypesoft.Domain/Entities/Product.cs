namespace Hypesoft.Domain.Entities;

public class Product
{
    public string Id { get; set; } = default!; // Mongo ObjectId as string
    public string Name { get; set; } = default!;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = default!;
    public int StockQuantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
