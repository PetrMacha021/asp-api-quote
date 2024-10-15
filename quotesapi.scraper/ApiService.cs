using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace quotesapi.scraper;

public class ApiService
{
    private readonly HttpClient _httpClient;

    public ApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task LoginAsync(string username, string password)
    {
        var loginData = new { email = username, password };
        var content   = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("http://localhost:5146/login", content);
        response.EnsureSuccessStatusCode();

        var     responseData = await response.Content.ReadAsStringAsync();
        dynamic data         = JsonConvert.DeserializeObject(responseData)!;

        string tokenType   = data.tokenType;
        string accessToken = data.accessToken;

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(tokenType, accessToken);
    }

    public async Task AddQuoteAsync(string text) {
        var quoteData = new { text };
        var content   = new StringContent(JsonConvert.SerializeObject(quoteData), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("http://localhost:5146/api/Quotes", content);
        response.EnsureSuccessStatusCode();
    }
}
