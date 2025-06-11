
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["library.Server/library.Server.csproj", "library.Server/"]
COPY ["library.client/package.json", "library.client/"]
COPY ["library.client/package-lock.json", "library.client/"]
COPY . .

RUN dotnet restore "library.Server/library.Server.csproj"

FROM node:20 AS frontend-build
WORKDIR /app
COPY library.client/ ./ 
RUN npm install
RUN npm run build

FROM build AS publish
RUN dotnet publish "library.Server/library.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

COPY --from=frontend-build /app/dist ./wwwroot

ENTRYPOINT ["dotnet", "library.Server.dll"]
