namespace Hypesoft.Application.DTOs;

public record ProductCreateDto(string Name, string Description, decimal Price, string CategoryId, int StockQuantity);
public record ProductUpdateDto(string Id, string Name, string Description, decimal Price, string CategoryId, int StockQuantity);
public record ProductListItemDto(string Id, string Name, decimal Price, string CategoryId, int StockQuantity);
public record PagedResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize);
