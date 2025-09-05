using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public record CreateProductCommand(ProductCreateDto Dto) : IRequest<string>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, string>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<string> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = _mapper.Map<Product>(request.Dto);
        product.Id = Guid.NewGuid().ToString("N");
        product.CreatedAt = DateTime.UtcNow;
        await _repo.AddAsync(product, cancellationToken);
        return product.Id;
    }
}
