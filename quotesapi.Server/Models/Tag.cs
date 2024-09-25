namespace quotesapi.Server.Models;

public class Tag {
    public int Id { set; get; }
    public string Text { set; get; }
    public ICollection<Quote> Quotes;
}
