using System.Text.Json.Serialization;

namespace quotesapi.Server.Models
{
    public class Tag
    {
        [JsonPropertyName("id")]
        public int TagId { get; set; }
        [JsonPropertyName("text")]
        public required string Text { get; set; }
        [JsonPropertyName("type")]
        public TagType Type { get; set; }
        [JsonIgnore]
        public ICollection<Quote> Quotes { get; set; } = [];
    }
}
