using Microsoft.EntityFrameworkCore;
using quotesapi.Server.Models;

namespace quotesapi.Server.Data;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : DbContext(options) {
    public DbSet<Quote> Quotes;
    public DbSet<Tag> Tags;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Quote>().ToTable("Quotes");
        modelBuilder.Entity<Tag>().ToTable("Tags");
    }
}
