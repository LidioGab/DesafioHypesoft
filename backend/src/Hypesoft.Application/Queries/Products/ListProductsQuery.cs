using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public record ListProductsQuery(string? Search, string? CategoryId, int Page = 1, int PageSize = 20) : IRequest<PagedResult<ProductListItemDto>>;

public class ListProductsQueryHandler : IRequestHandler<ListProductsQuery, PagedResult<ProductListItemDto>>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public ListProductsQueryHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<ProductListItemDto>> Handle(ListProductsQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _repo.ListAsync(request.Search, request.CategoryId, request.Page, request.PageSize, cancellationToken);
        var dtos = items.Select(p => _mapper.Map<ProductListItemDto>(p)).ToList();
        return new PagedResult<ProductListItemDto>(dtos, total, request.Page, request.PageSize);
    }
}
