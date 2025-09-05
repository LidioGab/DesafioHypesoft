using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public record DashboardResult(int TotalProducts, decimal TotalInventoryValue, IReadOnlyList<LowStockItem> LowStock, IDictionary<string,int> ProductsByCategory);
public record LowStockItem(string Id, string Name, int StockQuantity);

public record GetDashboardQuery() : IRequest<DashboardResult>;

public class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, DashboardResult>
{
    private readonly IProductRepository _products;

    public GetDashboardQueryHandler(IProductRepository products)
    {
        _products = products;
    }

    public async Task<DashboardResult> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var low = await _products.ListLowStockAsync(ct: cancellationToken);
        var totalValue = await _products.GetTotalInventoryValueAsync(cancellationToken);
        var byCategory = await _products.GetProductsByCategoryAsync(cancellationToken);
        var totalProducts = (await _products.ListAsync(null, null, 1, 1, cancellationToken)).Total;
        return new DashboardResult(
            (int)totalProducts,
            totalValue,
            low.Select(p => new LowStockItem(p.Id, p.Name, p.StockQuantity)).ToList(),
            byCategory
        );
    }
}
