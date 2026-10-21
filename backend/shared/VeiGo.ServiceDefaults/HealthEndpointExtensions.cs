using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace VeiGo.ServiceDefaults;

public static partial class HealthEndpointExtensions
{
    public static WebApplication MapVeiGoHealthEndpoints(this WebApplication app)
    {
        var serviceName = GetServiceName(app.Environment.ApplicationName);

        app.MapGet("/health/live", () => Results.Ok(new
        {
            status = "alive",
            service = serviceName
        }));

        app.MapGet("/health/ready", () => Results.Ok(new
        {
            status = "process-ready",
            service = serviceName,
            schema = serviceName,
            dependenciesChecked = false
        }));

        return app;
    }

    private static string GetServiceName(string applicationName)
    {
        var service = applicationName
            .Replace("VeiGo.", string.Empty, StringComparison.Ordinal)
            .Replace("Service", string.Empty, StringComparison.Ordinal);

        return Regex.Replace(service, "([a-z0-9])([A-Z])", "$1-$2")
            .ToLowerInvariant();
    }
}
