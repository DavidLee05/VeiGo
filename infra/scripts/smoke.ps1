$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $repositoryRoot "infra\docker-compose.yml"
$gatewayUrl = "http://localhost:5100"
$ports = @(5100, 5201, 5202, 5203, 5204, 5205, 5206, 5207, 5208, 5209)
$services = @(
    @{ Name = "user"; Port = 5201; Route = "users" },
    @{ Name = "catalog"; Port = 5202; Route = "catalog" },
    @{ Name = "search"; Port = 5203; Route = "search" },
    @{ Name = "booking"; Port = 5204; Route = "bookings" },
    @{ Name = "payment"; Port = 5205; Route = "payments" },
    @{ Name = "dealer"; Port = 5206; Route = "dealers" },
    @{ Name = "inventory"; Port = 5207; Route = "inventory" },
    @{ Name = "rental"; Port = 5208; Route = "rentals" },
    @{ Name = "notification"; Port = 5209; Route = "notifications" }
)

foreach ($port in $ports) {
    $deadline = (Get-Date).AddMinutes(2)
    $isListening = $false

    while ((Get-Date) -lt $deadline -and -not $isListening) {
        $client = New-Object System.Net.Sockets.TcpClient
        try {
            $client.Connect("127.0.0.1", $port)
            $isListening = $true
        }
        catch [System.Net.Sockets.SocketException] {
            Start-Sleep -Seconds 2
        }
        finally {
            $client.Dispose()
        }
    }

    if (-not $isListening) {
        throw "Timed out waiting for local port $port."
    }
}

$gatewayHealth = Invoke-RestMethod "$gatewayUrl/health/ready"
if ($gatewayHealth.service -ne "gateway") {
    throw "Gateway readiness returned unexpected service '$($gatewayHealth.service)'."
}

foreach ($service in $services) {
    $directHealth = Invoke-RestMethod "http://localhost:$($service.Port)/health/ready"
    if ($directHealth.service -ne $service.Name -or $directHealth.schema -ne $service.Name) {
        throw "$($service.Name) direct health endpoint returned unexpected service/schema."
    }

    $proxiedHealth = Invoke-RestMethod "$gatewayUrl/api/v1/$($service.Route)/health/ready"
    if ($proxiedHealth.service -ne $service.Name -or $proxiedHealth.schema -ne $service.Name) {
        throw "$($service.Name) gateway route returned unexpected service/schema."
    }

    Write-Host "PASS $($service.Name): direct and gateway health checks"
}

Write-Host "PASS gateway: readiness check"
