using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public record DeleteProductCommand(string Id) : IRequest;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _repo;

    public DeleteProductCommandHandler(IProductRepository repo)
    {
        _repo = repo;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        => await _repo.DeleteAsync(request.Id, cancellationToken);
}
