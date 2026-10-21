var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapGet("/health/live", () => Results.Ok(new
{
    status = "alive",
    service = "gateway"
}));

app.MapGet("/health/ready", () => Results.Ok(new
{
    status = "process-ready",
    service = "gateway"
}));

app.MapReverseProxy();
app.Run();
