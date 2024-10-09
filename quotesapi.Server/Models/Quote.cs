using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace quotesapi.Server.Models
{
    public class Quote
    {
        [JsonPropertyName("quoteId")]
        public int QuoteId { get; set; }
        [JsonPropertyName("text")]
        public required string Text { get; set; }
        [JsonPropertyName("created")]
        public DateTime Created { get; set; } = DateTime.Now;
        [JsonIgnore]
        public ICollection<Tag> Tags { get; set; } = [];
        [JsonPropertyName("user")]
        public IdentityUser? User { get; set; }
        [JsonPropertyName("userId")]
        public required string UserId { get; set; }
    }
}
