using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public record GetProductByIdQuery(string Id) : IRequest<Product?>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Product?>
{
    private readonly IProductRepository _repo;

    public GetProductByIdQueryHandler(IProductRepository repo)
    {
        _repo = repo;
    }

    public Task<Product?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        => _repo.GetByIdAsync(request.Id, cancellationToken);
}
