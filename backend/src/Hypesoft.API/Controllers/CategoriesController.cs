using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _repo;

    public CategoriesController(ICategoryRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
        => Ok(await _repo.ListAsync());

    [HttpPost]
    [Authorize(Roles = "admin,manager")]
    public async Task<ActionResult> Create(Category category)
    {
        category.Id = Guid.NewGuid().ToString("N");
        await _repo.AddAsync(category);
        return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<ActionResult> Update(string id, Category category)
    {
        if (id != category.Id) return BadRequest();
        await _repo.UpdateAsync(category);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> Delete(string id)
    {
        await _repo.DeleteAsync(id);
        return NoContent();
    }
}
