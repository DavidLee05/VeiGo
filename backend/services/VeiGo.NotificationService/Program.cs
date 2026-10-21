using VeiGo.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapVeiGoHealthEndpoints();
app.Run();
