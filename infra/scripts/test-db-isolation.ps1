$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $repositoryRoot "infra\docker-compose.yml"
$envFile = Join-Path $repositoryRoot ".env"
$localEnvironment = ConvertFrom-StringData (Get-Content $envFile -Raw)
$services = @(
    "user",
    "catalog",
    "search",
    "booking",
    "payment",
    "dealer",
    "inventory",
    "rental",
    "notification"
)

foreach ($service in $services) {
    $passwordVariable = "${service}_DB_PASSWORD".ToUpperInvariant()
    $password = $localEnvironment[$passwordVariable]
    if ([string]::IsNullOrWhiteSpace($password)) {
        throw "Missing $passwordVariable in .env."
    }

    foreach ($schema in $services) {
        $expected = if ($schema -eq $service) { "true:true" } else { "false:false" }
        $query = "SELECT has_schema_privilege(current_user, '$schema', 'USAGE')::text || ':' || has_schema_privilege(current_user, '$schema', 'CREATE')::text"
        $result = & docker compose --env-file $envFile -f $composeFile exec -T `
            -e "PGPASSWORD=$password" postgres `
            psql -h 127.0.0.1 -U "veigo_$service" -d veigo -tAc $query

        if ($LASTEXITCODE -ne 0) {
            throw "Could not verify schema '$schema' as role 'veigo_$service'."
        }

        if ($result.Trim() -ne $expected) {
            throw "Role 'veigo_$service' has unexpected USAGE/CREATE privileges on schema '$schema'."
        }
    }

    $publicAccess = & docker compose --env-file $envFile -f $composeFile exec -T `
        -e "PGPASSWORD=$password" postgres `
        psql -h 127.0.0.1 -U "veigo_$service" -d veigo -tAc `
        "SELECT has_schema_privilege(current_user, 'public', 'USAGE')::text || ':' || has_schema_privilege(current_user, 'public', 'CREATE')::text"

    if ($LASTEXITCODE -ne 0) {
        throw "Could not verify public schema permissions as role 'veigo_$service'."
    }

    if ($publicAccess.Trim() -ne "false:false") {
        throw "Role 'veigo_$service' has unexpected privileges on the public schema."
    }

    Write-Host "PASS veigo_${service}: access only to its own schema"
}
