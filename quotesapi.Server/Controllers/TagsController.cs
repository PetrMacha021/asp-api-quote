using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quotesapi.Server.Data;
using quotesapi.Server.Models;

namespace quotesapi.Server.Controllers;

[Route("api/V[controller]")]
[ApiController]
public class TagsController : ControllerBase {
    private readonly ApplicationContext _context;

    public TagsController(ApplicationContext context) {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tag>>> GetTags() {
        return await _context.Tags.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tag>> GetTag(int id) {
        var tag = await _context.Tags.FindAsync(id);

        if (tag == null) {
            return NotFound();
        }

        return tag;
    }

    [HttpGet("{id}/random")]
    public async Task<ActionResult<Quote>> GetTagRandomQuote(int id) {
        var tag = await _context.Tags.Include(t => t.Quotes).FirstOrDefaultAsync(t => t.TagId == id);

        if (tag == null) {
            return NotFound();
        }

        var num   = tag.Quotes.Count;
        var quote = tag.Quotes.Skip(new Random().Next(num)).FirstOrDefault();

        if (quote == null) {
            return NotFound();
        }

        return quote;
    }

    [HttpGet("{id}/quotes")]
    public async Task<ActionResult<string>> GetTagQuotes(int id) {
        var tag = await _context.Tags.Include(t => t.Quotes).FirstOrDefaultAsync(t => t.TagId == id);

        if (tag == null) {
            return NotFound();
        }

        foreach (var quote in tag.Quotes) {
            quote.Tags = new List<Tag>();
        }

        return JsonSerializer.Serialize(tag.Quotes);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutTag(int id, Tag tag) {
        if (id != tag.TagId) {
            return BadRequest();
        }

        _context.Entry(tag).State = EntityState.Modified;

        try {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) {
            if (!TagExists(id)) {
                return NotFound();
            }
            else {
                throw;
            }
        }

        return NoContent();
    }

    [HttpPost("text")]
    public async Task<ActionResult<Tag>> GetTagByText(string text) {
        var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Text == text);

        if (tag == null) {
            return NotFound();
        }

        return tag;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Tag>> PostTag(Tag tag) {
        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTag", new { id = tag.TagId }, tag);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTag(int id) {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) {
            return NotFound();
        }

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TagExists(int id) {
        return _context.Tags.Any(e => e.TagId == id);
    }
}
