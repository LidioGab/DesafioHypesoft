using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public record UpdateProductCommand(ProductUpdateDto Dto) : IRequest;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = _mapper.Map<Hypesoft.Domain.Entities.Product>(request.Dto);
        await _repo.UpdateAsync(product, cancellationToken);
    }
}
