namespace quotesapi.Server.Models;

public class Quote {
    public int Id { set; get; }
    public string Text { set; get; }
    public ICollection<Tag> Tags;
}
