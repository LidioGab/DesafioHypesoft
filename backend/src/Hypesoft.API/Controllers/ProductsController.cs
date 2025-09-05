using AutoMapper;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PagedResult<ProductListItemDto>>> Get([FromQuery] string? search, [FromQuery] string? categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new ListProductsQuery(search, categoryId, page, pageSize));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager")]
    public async Task<ActionResult<string>> Create([FromBody] ProductCreateDto dto)
    {
        var id = await _mediator.Send(new CreateProductCommand(dto));
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<ActionResult> Update(string id, [FromBody] ProductUpdateDto dto)
    {
        if (id != dto.Id) return BadRequest();
        await _mediator.Send(new UpdateProductCommand(dto));
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> Delete(string id)
    {
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}
