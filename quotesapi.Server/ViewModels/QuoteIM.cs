namespace quotesapi.Server.ViewModels
{
    public class QuoteIM
    {
        public int QuoteId { get; set; }
        public required string Text { get; set; } = string.Empty;
    }
}
