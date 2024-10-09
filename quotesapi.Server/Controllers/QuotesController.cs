using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quotesapi.Server.Data;
using quotesapi.Server.Models;
using quotesapi.Server.ViewModels;

namespace quotesapi.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuotesController : ControllerBase {
    private readonly ApplicationContext _context;

    public QuotesController(ApplicationContext context) {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes() {
        return await _context.Quotes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetQuote(int id) {
        var quote = await _context.Quotes.FindAsync(id);

        if (quote == null) {
            return NotFound();
        }

        return quote;
    }

    [HttpGet("random")]
    public async Task<ActionResult<Quote>> GetRandomQuote() {
        var num   = await _context.Quotes.CountAsync();
        var quote = await _context.Quotes.Skip(new Random().Next(num)).FirstOrDefaultAsync();

        if (quote == null) {
            return NotFound();
        }

        return quote;
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutQuote(int id, Quote quote) {
        if (id != quote.QuoteId) {
            return BadRequest();
        }

        if (quote.UserId != User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value) {
            return Forbid();
        }

        _context.Entry(quote).State = EntityState.Modified;

        try {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) {
            if (!QuoteExists(id)) {
                return NotFound();
            }
            else {
                throw;
            }
        }

        return NoContent();
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Quote>> PostQuote(QuoteIM input) {
        var quote = new Quote {
            Text    = input.Text,
            Created = DateTime.Now,
            UserId  = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "?",
        };
        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuote", new { id = quote.QuoteId }, quote);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteQuote(int id) {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null) {
            return NotFound();
        }

        if (quote.UserId != User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value) {
            return Forbid();
        }

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("text")]
    public async Task<ActionResult<Quote>> GetQuoteByText(string text) {
        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Text == text);

        if (quote == null) {
            return NotFound();
        }

        return quote;
    }

    [HttpPost("{id}/tags/{tagId}")]
    [Authorize]
    public async Task<IActionResult> PostQuoteTag(int id, int tagId) {
        var quote = await _context.Quotes.Include(q => q.Tags).FirstOrDefaultAsync(q => q.QuoteId == id);
        if (quote == null) {
            return NotFound();
        }

        var tag = await _context.Tags.FindAsync(tagId);
        if (tag == null) {
            return NotFound();
        }

        quote.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuote", new { id = quote.QuoteId }, quote);
    }

    [HttpDelete("{id}/tags/{tagId}")]
    [Authorize]
    public async Task<IActionResult> DeleteQuoteTag(int id, int tagId) {
        var quote = await _context.Quotes.Include(q => q.Tags).FirstOrDefaultAsync(q => q.QuoteId == id);
        if (quote == null) {
            return NotFound();
        }

        var tag = quote.Tags.FirstOrDefault(t => t.TagId == tagId);
        if (tag == null) {
            return NotFound();
        }

        quote.Tags.Remove(tag);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool QuoteExists(int id) {
        return _context.Quotes.Any(e => e.QuoteId == id);
    }
}
