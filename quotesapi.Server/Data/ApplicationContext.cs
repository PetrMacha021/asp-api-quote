using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using quotesapi.Server.Models;

namespace quotesapi.Server.Data;

public class ApplicationContext : IdentityDbContext<IdentityUser> {
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }

    public DbSet<Quote> Quotes { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public override DbSet<IdentityUser> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<QuoteTag>().HasKey(qt => new { qt.QuoteId, qt.TagId });
        modelBuilder.Entity<IdentityUser>(options => {
            options.HasData(new IdentityUser {
                Id                 = "00000000-0000-0000-0000-000000000000",
                UserName           = "admin",
                NormalizedUserName = "ADMIN",
                Email              = "admin@local.test",
                NormalizedEmail    = "ADMIN@LOCAL.TEST",
                EmailConfirmed     = true,
                PasswordHash =
                    new PasswordHasher<IdentityUser>().HashPassword(null, "admin"),
                SecurityStamp = string.Empty
            });
        });
        modelBuilder.Entity<Quote>(options => {
                options.HasMany(q => q.Tags).WithMany(t => t.Quotes).UsingEntity<QuoteTag>();
                options.HasData(new Quote {
                    QuoteId = 1,
                    Text =
                        "Když už člověk jednou je, tak má koukat aby byl. A když kouká, aby byl, a je, tak má být to, co je, a nemá být to, co není, jak tomu v mnoha případech je.",
                    Created = DateTime.Now,
                    UserId  = "7ad2e6a5-700d-4793-96ef-9902dedf12f2",
                });
            }
        );
        modelBuilder.Entity<Tag>(options => {
                options.HasData(new Tag {
                    TagId = 1,
                    Text  = "Filosofie",
                    Type  = TagType.Category,
                });
            }
        );
        modelBuilder.Entity<QuoteTag>(options => {
            options.HasData(new QuoteTag {
                QuoteId = 1,
                TagId   = 1,
            });
        });
    }
}
