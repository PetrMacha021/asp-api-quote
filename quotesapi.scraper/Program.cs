using HtmlAgilityPack;
using quotesapi.scraper;

const int pages = 2;

for (int i = 1; i <= pages; i++) {
    var html = $"https://www.azquotes.com/top_quotes.html?p={i}";
    var web  = new HtmlWeb();

    var api = new ApiService(new HttpClient());

    await api.LoginAsync("admin", "admin");

    var htmlDoc    = web.Load(html);
    var quotesList = htmlDoc.DocumentNode.SelectSingleNode("//ul[contains(@class, 'list-quotes')]");
    if (quotesList == null) {
        throw new Exception("No quotes found on page");
    }

    var quotes = quotesList.SelectNodes("li");

    Console.WriteLine($"Page {i}");
    Console.WriteLine($"Found {quotes.Count} quotes");

    foreach (var quote in quotes) {
        var text = quote.SelectSingleNode(".//div/p/a[contains(@class, 'title')]").InnerText;
        await api.AddQuoteAsync(text);
    }
}
