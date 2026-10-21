FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

ARG SERVICE_PROJECT
COPY . .
RUN dotnet restore "$SERVICE_PROJECT"
RUN dotnet publish "$SERVICE_PROJECT" --configuration Release --output /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ARG SERVICE_DLL
ENV SERVICE_DLL=${SERVICE_DLL}
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec dotnet \"$SERVICE_DLL\""]
