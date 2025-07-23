---
title: 'Guía Completa: Monitoreo Avanzado con .NET, Blazor, Prometheus y Grafana'
excerpt: Aprende a crear un sistema completo de monitoreo usando ASP.NET Core, Blazor Server, Prometheus y Grafana. Incluye métricas en tiempo real, alertas inteligentes y dashboards interactivos para aplicaciones empresariales.
publishDate: 'January 23 2025'
tags:
  - .NET
  - Blazor
  - Prometheus
  - Grafana
  - Monitoreo
  - AlertManager
  - Docker
  - DevOps
seo:
  image:
    src: '/post-6.jpg'
    alt: Dashboard de monitoreo con Blazor, Prometheus y Grafana
---

![Dashboard de monitoreo con Blazor, Prometheus y Grafana](/post-6.jpg)

El monitoreo moderno de aplicaciones requiere herramientas robustas y interfaces intuitivas. En esta guía completa, aprenderás a crear un sistema de monitoreo de nivel empresarial utilizando **ASP.NET Core**, **Blazor Server**, **Prometheus** y **Grafana**.

Construiremos una aplicación demo completa que incluye métricas en tiempo real, alertas inteligentes, webhooks de notificación y dashboards interactivos, todo orquestado con Docker Compose para un despliegue simple y escalable.

## 🎯 ¿Qué Vamos a Construir?

### Stack Tecnológico
- **ASP.NET Core 8.0**: Framework web moderno y de alto rendimiento
- **Blazor Server**: UI interactiva con SignalR para actualizaciones en tiempo real
- **Prometheus**: Sistema de monitoreo y base de datos de series temporales
- **Grafana**: Plataforma de visualización de datos
- **AlertManager**: Sistema de gestión de alertas inteligente
- **Docker Compose**: Orquestación de servicios

### Características del Sistema
- **Dashboard interactivo** con métricas en tiempo real
- **Simuladores de carga** para testing de alertas
- **Sistema de alertas** configurable con webhooks
- **API REST** para integración externa
- **Interfaz moderna** con Bootstrap 5
- **Arquitectura escalable** basada en contenedores

## 🚀 Preparativos Iniciales

### Requisitos del Sistema

```bash
# Verificar Docker y Docker Compose
docker --version
docker compose --version

# Verificar .NET SDK (para desarrollo local)
dotnet --version

# Puertos necesarios
# 8000  - Aplicación .NET Demo
# 9090  - Prometheus
# 3000  - Grafana
# 9093  - AlertManager
```

### Estructura del Proyecto

```
prometheus-grafana-dotnet/
├── demo-app/                   # Aplicación .NET + Blazor
│   ├── Pages/                  # Páginas Blazor
│   ├── Services/               # Servicios de negocio
│   ├── Models/                 # Modelos de datos
│   ├── Shared/                 # Componentes compartidos
│   └── Program.cs              # Configuración de la app
├── prometheus/                 # Configuración Prometheus
│   └── prometheus.yml
├── grafana/                    # Dashboards Grafana
│   └── dashboards/
├── alertmanager/               # Configuración AlertManager
│   └── alertmanager.yml
└── docker-compose.yml          # Orquestación
```
## 📦 Configuración de la Aplicación .NET

### Paso 1: Crear el Proyecto Base

```bash
# Crear directorio del proyecto
mkdir prometheus-grafana-dotnet
cd prometheus-grafana-dotnet

# Crear aplicación Blazor Server
dotnet new blazorserver -n demo-app
cd demo-app

# Agregar paquetes necesarios
dotnet add package prometheus-net.AspNetCore
dotnet add package Newtonsoft.Json
```

### Paso 2: Configurar DemoApp.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="prometheus-net.AspNetCore" Version="8.2.1" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>
</Project>
```

### Paso 3: Configurar Program.cs

```csharp
using DemoApp.Models;
using DemoApp.Services;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// Configurar servicios
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Registrar servicios personalizados
builder.Services.AddSingleton<AlertStorage>();
builder.Services.AddSingleton<MetricsService>();

var app = builder.Build();

// Configurar pipeline HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseRouting();

// Habilitar métricas de Prometheus
app.UseHttpMetrics();

app.MapRazorPages();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

// Endpoint de métricas para Prometheus
app.MapMetrics();

// API Endpoints
app.MapGet("/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow 
});

app.MapGet("/api/alerts", (AlertStorage storage) => storage.GetAlerts());

app.MapPost("/api/webhook/alerts", async (HttpRequest request, AlertStorage storage) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
    
    var webhook = Newtonsoft.Json.JsonConvert.DeserializeObject<AlertWebhook>(body);
    if (webhook?.Alerts != null)
    {
        foreach (var alert in webhook.Alerts)
        {
            storage.AddAlert(alert);
        }
    }
    
    return Results.Ok(new { received = webhook?.Alerts?.Length ?? 0 });
});

// Inicializar servicios en background
var metricsService = app.Services.GetRequiredService<MetricsService>();
_ = Task.Run(() => metricsService.StartBackgroundSimulation());

app.Run();
```

## 🎨 Creando la Interfaz Blazor

### Dashboard Principal (Pages/Index.razor)

```razor
@page "/"
@using DemoApp.Services
@using DemoApp.Models
@inject MetricsService MetricsService
@inject AlertStorage AlertStorage
@inject IJSRuntime JSRuntime
@implements IDisposable

<PageTitle>📊 Demo App - Prometheus & Grafana</PageTitle>

<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <h1 class="text-primary">
                <i class="fas fa-chart-line"></i> 
                Dashboard de Monitoreo (.NET + Blazor)
            </h1>
            <p class="lead">Sistema de monitoreo en tiempo real con Prometheus y Grafana</p>
        </div>
    </div>

    <!-- Estadísticas en tiempo real -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <h5><i class="fas fa-tachometer-alt"></i> Requests/min</h5>
                    <h3>@currentStats.RequestsPerMinute</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                    <h5><i class="fas fa-memory"></i> Memoria (MB)</h5>
                    <h3>@currentStats.MemoryUsageMB</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white">
                <div class="card-body">
                    <h5><i class="fas fa-microchip"></i> CPU %</h5>
                    <h3>@currentStats.CpuUsagePercent.ToString("F1")</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body">
                    <h5><i class="fas fa-exclamation-triangle"></i> Alertas</h5>
                    <h3>@AlertStorage.GetActiveAlertsCount()</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Controles de simulación -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-play-circle"></i> Simuladores de Carga</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <button class="btn btn-primary w-100" @onclick="SimulateHighTraffic">
                                <i class="fas fa-rocket"></i> Simular Alto Tráfico
                            </button>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-warning w-100" @onclick="SimulateHighCpu">
                                <i class="fas fa-fire"></i> Simular Alta CPU
                            </button>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-danger w-100" @onclick="SimulateErrors">
                                <i class="fas fa-bug"></i> Simular Errores
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Enlaces útiles -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-link"></i> Enlaces del Sistema</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <a href="/alerts" class="btn btn-outline-primary w-100">
                                <i class="fas fa-bell"></i> Dashboard Alertas
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="http://localhost:9090" target="_blank" class="btn btn-outline-success w-100">
                                <i class="fas fa-chart-bar"></i> Prometheus
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="http://localhost:3000" target="_blank" class="btn btn-outline-info w-100">
                                <i class="fas fa-chart-area"></i> Grafana
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="http://localhost:9093" target="_blank" class="btn btn-outline-warning w-100">
                                <i class="fas fa-exclamation-circle"></i> AlertManager
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@code {
    private Timer? timer;
    private ApplicationStats currentStats = new();

    protected override void OnInitialized()
    {
        timer = new Timer(async _ => await UpdateStats(), null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
    }

    private async Task UpdateStats()
    {
        currentStats = MetricsService.GetCurrentStats();
        await InvokeAsync(StateHasChanged);
    }

    private async Task SimulateHighTraffic()
    {
        await MetricsService.SimulateHighTrafficAsync();
        await JSRuntime.InvokeVoidAsync("alert", "🚀 Simulación de alto tráfico iniciada");
    }

    private async Task SimulateHighCpu()
    {
        await MetricsService.SimulateHighCpuAsync();
        await JSRuntime.InvokeVoidAsync("alert", "🔥 Simulación de alta CPU iniciada");
    }

    private async Task SimulateErrors()
    {
        await MetricsService.SimulateErrorsAsync();
        await JSRuntime.InvokeVoidAsync("alert", "🐛 Simulación de errores iniciada");
    }

    public void Dispose()
    {
        timer?.Dispose();
    }
}
```

### Dashboard de Alertas (Pages/Alerts.razor)

```razor
@page "/alerts"
@using DemoApp.Models
@inject AlertStorage AlertStorage
@implements IDisposable

<PageTitle>🚨 Alertas del Sistema</PageTitle>

<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <h1 class="text-danger">
                <i class="fas fa-bell"></i> 
                Dashboard de Alertas
            </h1>
            <p class="lead">Monitoreo en tiempo real de alertas del sistema</p>
        </div>
    </div>

    <!-- Filtros y controles -->
    <div class="row mb-4">
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-filter"></i></span>
                <select class="form-select" @bind="selectedStatus" @onchange="FilterAlerts">
                    <option value="all">Todas las Alertas</option>
                    <option value="firing">🔥 Activas</option>
                    <option value="resolved">✅ Resueltas</option>
                </select>
            </div>
        </div>
        <div class="col-md-6">
            <div class="text-end">
                <span class="badge bg-danger fs-6">
                    Activas: @AlertStorage.GetActiveAlertsCount()
                </span>
                <span class="badge bg-success fs-6 ms-2">
                    Total: @filteredAlerts.Count
                </span>
            </div>
        </div>
    </div>

    <!-- Lista de alertas -->
    <div class="row">
        @if (filteredAlerts.Any())
        {
            @foreach (var alert in filteredAlerts.OrderByDescending(a => a.StartsAt))
            {
                <div class="col-12 mb-3">
                    <div class="card @(alert.Status == "firing" ? "border-danger" : "border-success")">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">
                                @if (alert.Status == "firing")
                                {
                                    <span class="badge bg-danger">🔥 ACTIVA</span>
                                }
                                else
                                {
                                    <span class="badge bg-success">✅ RESUELTA</span>
                                }
                                <strong>@alert.Labels.GetValueOrDefault("alertname", "Sin nombre")</strong>
                            </h6>
                            <small class="text-muted">
                                @alert.StartsAt.ToString("dd/MM/yyyy HH:mm:ss")
                            </small>
                        </div>
                        <div class="card-body">
                            <p class="mb-2">
                                <strong>Instancia:</strong> 
                                @alert.Labels.GetValueOrDefault("instance", "N/A")
                            </p>
                            @if (!string.IsNullOrEmpty(alert.Annotations.GetValueOrDefault("description")))
                            {
                                <p class="mb-2">
                                    <strong>Descripción:</strong> 
                                    @alert.Annotations["description"]
                                </p>
                            }
                            @if (alert.Labels.Any())
                            {
                                <div class="mt-2">
                                    @foreach (var label in alert.Labels)
                                    {
                                        <span class="badge bg-secondary me-1">
                                            @label.Key: @label.Value
                                        </span>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        }
        else
        {
            <div class="col-12">
                <div class="text-center p-5">
                    <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    <h3 class="mt-3">No hay alertas</h3>
                    <p class="text-muted">El sistema funciona correctamente</p>
                </div>
            </div>
        }
    </div>
</div>

@code {
    private Timer? timer;
    private string selectedStatus = "all";
    private List<Alert> filteredAlerts = new();

    protected override void OnInitialized()
    {
        FilterAlerts();
        timer = new Timer(async _ => await UpdateAlerts(), null, TimeSpan.Zero, TimeSpan.FromSeconds(3));
    }

    private async Task UpdateAlerts()
    {
        FilterAlerts();
        await InvokeAsync(StateHasChanged);
    }

    private void FilterAlerts()
    {
        var allAlerts = AlertStorage.GetAlerts();
        
        filteredAlerts = selectedStatus switch
        {
            "firing" => allAlerts.Where(a => a.Status == "firing").ToList(),
            "resolved" => allAlerts.Where(a => a.Status == "resolved").ToList(),
            _ => allAlerts.ToList()
        };
    }

    public void Dispose()
    {
        timer?.Dispose();
    }
}
```

## 🔧 Servicios de Backend

### MetricsService.cs

```csharp
using Prometheus;
using DemoApp.Models;

namespace DemoApp.Services;

public class MetricsService
{
    // Métricas Prometheus
    private readonly Counter _requestsTotal = Metrics
        .CreateCounter("http_requests_total", "Total HTTP requests", "method", "endpoint");
    
    private readonly Gauge _memoryUsage = Metrics
        .CreateGauge("memory_usage_bytes", "Current memory usage in bytes");
    
    private readonly Gauge _cpuUsage = Metrics
        .CreateGauge("cpu_usage_percent", "Current CPU usage percentage");
    
    private readonly Histogram _requestDuration = Metrics
        .CreateHistogram("http_request_duration_seconds", "HTTP request duration");

    private readonly Random _random = new();
    private readonly ApplicationStats _currentStats = new();
    private bool _isRunning = true;

    public ApplicationStats GetCurrentStats() => _currentStats;

    public void StartBackgroundSimulation()
    {
        Task.Run(async () =>
        {
            while (_isRunning)
            {
                // Simular métricas base
                _currentStats.RequestsPerMinute = _random.Next(50, 200);
                _currentStats.MemoryUsageMB = _random.Next(100, 500);
                _currentStats.CpuUsagePercent = _random.NextDouble() * 30 + 10; // 10-40%

                // Actualizar métricas Prometheus
                _memoryUsage.Set(_currentStats.MemoryUsageMB * 1024 * 1024);
                _cpuUsage.Set(_currentStats.CpuUsagePercent);
                
                // Simular requests
                for (int i = 0; i < _random.Next(1, 5); i++)
                {
                    _requestsTotal.WithLabels("GET", "/api/data").Inc();
                }

                await Task.Delay(2000);
            }
        });
    }

    public async Task SimulateHighTrafficAsync()
    {
        for (int i = 0; i < 100; i++)
        {
            _requestsTotal.WithLabels("GET", "/api/heavy").Inc();
            _currentStats.RequestsPerMinute += 10;
            await Task.Delay(50);
        }
    }

    public async Task SimulateHighCpuAsync()
    {
        _currentStats.CpuUsagePercent = 85;
        _cpuUsage.Set(85);
        
        await Task.Delay(30000); // Mantener por 30 segundos
        
        _currentStats.CpuUsagePercent = _random.NextDouble() * 30 + 10;
        _cpuUsage.Set(_currentStats.CpuUsagePercent);
    }

    public async Task SimulateErrorsAsync()
    {
        for (int i = 0; i < 50; i++)
        {
            _requestsTotal.WithLabels("GET", "/api/error").Inc();
            await Task.Delay(100);
        }
    }

    public void Stop()
    {
        _isRunning = false;
    }
}
```

### AlertStorage.cs

```csharp
using DemoApp.Models;
using System.Collections.Concurrent;

namespace DemoApp.Services;

public class AlertStorage
{
    private readonly ConcurrentBag<Alert> _alerts = new();

    public void AddAlert(Alert alert)
    {
        _alerts.Add(alert);
        
        // Limpiar alertas antiguas (mantener últimas 100)
        if (_alerts.Count > 100)
        {
            var oldAlerts = _alerts.OrderBy(a => a.StartsAt).Take(_alerts.Count - 100);
            foreach (var old in oldAlerts)
            {
                _alerts.TryTake(out _);
            }
        }
    }

    public List<Alert> GetAlerts()
    {
        return _alerts.ToList();
    }

    public int GetActiveAlertsCount()
    {
        return _alerts.Count(a => a.Status == "firing");
    }
}
```

## 🐳 Configuración con Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Aplicación Demo .NET
  demo-app-dotnet:
    build:
      context: ./demo-app
      dockerfile: Dockerfile
    container_name: demo-metrics-app-dotnet
    ports:
      - "8000:8000"
    environment:
      - ASPNETCORE_URLS=http://+:8000
      - ASPNETCORE_ENVIRONMENT=Production
    networks:
      - monitoring-dotnet
    depends_on:
      - prometheus-server-dotnet

  # Prometheus
  prometheus-server-dotnet:
    image: prom/prometheus:latest
    container_name: prometheus-server-dotnet
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alert.rules.yml:/etc/prometheus/alert.rules.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - monitoring-dotnet
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AlertManager
  alertmanager-dotnet:
    image: prom/alertmanager:latest
    container_name: alertmanager-dotnet
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    networks:
      - monitoring-dotnet
    depends_on:
      prometheus-server-dotnet:
        condition: service_healthy

  # Grafana
  grafana-dashboard-dotnet:
    image: grafana/grafana:latest
    container_name: grafana-dashboard-dotnet
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - ./grafana/dashboards:/var/lib/grafana/dashboards
      - ./grafana/provisioning:/etc/grafana/provisioning
    networks:
      - monitoring-dotnet
    depends_on:
      - prometheus-server-dotnet

  # Node Exporter
  node-exporter-dotnet:
    image: prom/node-exporter:latest
    container_name: node-exporter-dotnet
    ports:
      - "9100:9100"
    networks:
      - monitoring-dotnet

  # cAdvisor
  cadvisor-dotnet:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor-dotnet
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - monitoring-dotnet

networks:
  monitoring-dotnet:
    driver: bridge
```

### Dockerfile para la aplicación .NET

```dockerfile
# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar proyecto y restaurar dependencias
COPY *.csproj .
RUN dotnet restore

# Copiar código fuente y compilar
COPY . .
RUN dotnet build -c Release -o /app/build

# Etapa de publish
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Etapa final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Crear usuario no privilegiado
RUN addgroup --system --gid 1001 dotnet
RUN adduser --system --uid 1001 --gid 1001 dotnet

# Copiar aplicación
COPY --from=publish /app/publish .

# Cambiar a usuario no privilegiado
USER dotnet

# Configurar puerto
EXPOSE 8000

# Comando de inicio
ENTRYPOINT ["dotnet", "DemoApp.dll"]
```

## 📊 Configuración de Prometheus

### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert.rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager-dotnet:9093

scrape_configs:
  # Aplicación .NET Demo
  - job_name: 'demo-app-dotnet'
    static_configs:
      - targets: ['demo-app-dotnet:8000']
    metrics_path: /metrics
    scrape_interval: 5s

  # Prometheus
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter-dotnet:9100']

  # cAdvisor
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor-dotnet:8080']
```

### alert.rules.yml

```yaml
groups:
- name: demo-app-alerts
  rules:
  - alert: HighCPUUsage
    expr: cpu_usage_percent > 80
    for: 1m
    labels:
      severity: warning
      service: demo-app-dotnet
    annotations:
      summary: "Alta utilización de CPU detectada"
      description: "El uso de CPU está en {{ $value }}% por más de 1 minuto"

  - alert: HighMemoryUsage
    expr: memory_usage_bytes > 400000000
    for: 2m
    labels:
      severity: critical
      service: demo-app-dotnet
    annotations:
      summary: "Alto uso de memoria detectado"
      description: "El uso de memoria está en {{ $value | humanize }}B por más de 2 minutos"

  - alert: HighRequestRate
    expr: rate(http_requests_total[5m]) > 10
    for: 30s
    labels:
      severity: warning
      service: demo-app-dotnet
    annotations:
      summary: "Alto ratio de requests detectado"
      description: "Rate de requests: {{ $value | humanize }}req/s por más de 30 segundos"
```

## 🚨 Configuración de AlertManager

### alertmanager.yml

```yaml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@company.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'webhook-receiver'

receivers:
- name: 'webhook-receiver'
  webhook_configs:
  - url: 'http://demo-app-dotnet:8000/api/webhook/alerts'
    send_resolved: true
    http_config:
      proxy_url: ''
    title: 'Alerta del Sistema'
    text: 'Descripción: {{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
```

## 🎯 Script de Testing

### test-webhook-dotnet.sh

```bash
#!/bin/bash

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Script de prueba del webhook de AlertManager (.NET + Blazor)${NC}"
echo "=============================================================="

# URLs importantes
DEMO_APP_URL="http://localhost:8000"
ALERTS_URL="http://localhost:8000/alerts"
WEBHOOK_URL="http://localhost:8000/api/webhook/alerts"
API_ALERTS_URL="http://localhost:8000/api/alerts"
PROMETHEUS_URL="http://localhost:9090"
ALERTMANAGER_URL="http://localhost:9093"
GRAFANA_URL="http://localhost:3000"

echo -e "${BLUE}📊 URLs importantes (.NET Demo):${NC}"
echo "   Demo App (.NET): $DEMO_APP_URL"
echo "   Dashboard de Alertas: $ALERTS_URL"
echo "   Webhook: $WEBHOOK_URL"
echo "   API de Alertas: $API_ALERTS_URL"
echo "   Prometheus: $PROMETHEUS_URL"
echo "   AlertManager: $ALERTMANAGER_URL"
echo "   Grafana: $GRAFANA_URL (admin/admin123)"
echo ""

# Función para verificar si la demo app está disponible
check_demo_app() {
    echo -e "${BLUE}🔍 Verificando demo app .NET...${NC}"
    if curl -s -f "$DEMO_APP_URL/health" > /dev/null; then
        echo -e "${GREEN}✅ Demo app .NET está disponible${NC}"
        return 0
    else
        echo -e "${RED}❌ Demo app .NET no está disponible${NC}"
        return 1
    fi
}

# Función para generar requests y activar alertas
generate_load() {
    echo -e "${YELLOW}🚀 Generando carga para activar alertas...${NC}"
    echo "Simulando alto tráfico..."
    
    for i in {1..20}; do
        curl -s "$DEMO_APP_URL/health" > /dev/null &
        curl -s "$DEMO_APP_URL/api/alerts" > /dev/null &
        sleep 0.1
    done
    
    wait
    echo -e "${GREEN}✅ Carga generada exitosamente${NC}"
}

# Función para simular carga CPU/memoria
simulate_load() {
    echo -e "${YELLOW}🔥 Simulando carga de CPU y memoria...${NC}"
    echo "Esto debería activar alertas de alto uso de recursos..."
    
    # Estas llamadas deberían activar las simulaciones en la aplicación
    # En una implementación real, podrías llamar endpoints específicos
    echo "Simulación iniciada en la aplicación .NET"
    echo -e "${GREEN}✅ Simulación de carga completada${NC}"
}

# Función para probar webhook manualmente
test_webhook() {
    echo -e "${YELLOW}🧪 Probando webhook manualmente...${NC}"
    
    # Crear payload de prueba
    cat << 'EOF' > /tmp/test_alert.json
{
  "version": "4",
  "groupKey": "test_group",
  "status": "firing",
  "receiver": "webhook-receiver",
  "groupLabels": {
    "alertname": "TestAlert"
  },
  "commonLabels": {
    "alertname": "TestAlert",
    "instance": "demo-app:8000",
    "job": "demo-app-dotnet",
    "severity": "warning"
  },
  "commonAnnotations": {
    "description": "Esta es una alerta de prueba generada manualmente",
    "summary": "Alerta de prueba del webhook"
  },
  "externalURL": "http://localhost:9093",
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "TestAlert",
        "instance": "demo-app:8000",
        "job": "demo-app-dotnet",
        "severity": "warning"
      },
      "annotations": {
        "description": "Esta es una alerta de prueba generada manualmente",
        "summary": "Alerta de prueba del webhook"
      },
      "startsAt": "2024-01-20T10:00:00.000Z",
      "endsAt": "0001-01-01T00:00:00Z",
      "fingerprint": "test123456"
    }
  ]
}
EOF

    # Enviar webhook
    echo "Enviando alerta de prueba al webhook..."
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d @/tmp/test_alert.json \
        "$WEBHOOK_URL")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Webhook test exitoso${NC}"
        echo "Respuesta: $response_body"
    else
        echo -e "${RED}❌ Webhook test falló (HTTP $http_code)${NC}"
        echo "Respuesta: $response_body"
    fi
    
    # Limpiar archivo temporal
    rm -f /tmp/test_alert.json
}

# Función para mostrar estado actual
show_status() {
    echo -e "${BLUE}📊 Estado actual del sistema:${NC}"
    echo ""
    
    if check_demo_app; then
        echo -e "${BLUE}🔍 Obteniendo alertas actuales...${NC}"
        alerts_response=$(curl -s "$API_ALERTS_URL" 2>/dev/null || echo "[]")
        alerts_count=$(echo "$alerts_response" | jq '. | length' 2>/dev/null || echo "Error")
        
        if [ "$alerts_count" != "Error" ]; then
            echo -e "${YELLOW}📈 Total de alertas: $alerts_count${NC}"
            if [ "$alerts_count" -gt 0 ]; then
                echo -e "${BLUE}Últimas alertas:${NC}"
                echo "$alerts_response" | jq -r '.[:3][] | "  - \(.labels.alertname // "Unknown"): \(.status) (\(.startsAt // "N/A"))"' 2>/dev/null || echo "  Error al parsear alertas"
            fi
        else
            echo -e "${RED}❌ Error al obtener alertas${NC}"
        fi
    fi
}

# Función para prueba completa
full_test() {
    echo -e "${YELLOW}🧪 Ejecutando prueba completa (.NET + Blazor)...${NC}"
    echo "================================================"
    
    if ! check_demo_app; then
        echo -e "${RED}❌ La demo app .NET no está disponible. Verifica que Docker Compose esté ejecutándose.${NC}"
        echo -e "${BLUE}💡 Ejecuta: docker compose up -d${NC}"
        return 1
    fi
    
    echo ""
    test_webhook
    echo ""
    generate_load
    echo ""
    simulate_load
    echo ""
    echo -e "${BLUE}⏳ Esperando 10 segundos para que se procesen las métricas...${NC}"
    sleep 10
    echo ""
    show_status
    
    echo ""
    echo -e "${GREEN}🎉 Prueba completa finalizada${NC}"
    echo -e "${BLUE}💡 Visita las siguientes URLs para ver los resultados:${NC}"
    echo "   📊 Dashboard principal: $DEMO_APP_URL"
    echo "   🚨 Dashboard de alertas: $ALERTS_URL"
    echo "   📈 Prometheus: $PROMETHEUS_URL"
    echo "   📉 Grafana: $GRAFANA_URL"
}

# Función para abrir dashboard de alertas
open_alerts_dashboard() {
    echo -e "${BLUE}🚨 Abriendo dashboard de alertas...${NC}"
    if command -v xdg-open > /dev/null; then
        xdg-open "$ALERTS_URL"
    elif command -v open > /dev/null; then
        open "$ALERTS_URL"
    else
        echo -e "${YELLOW}💡 Abre manualmente: $ALERTS_URL${NC}"
    fi
}

# Función para mostrar información del proyecto
show_project_info() {
    echo -e "${BLUE}📋 Información del proyecto (.NET + Blazor + Prometheus)${NC}"
    echo "========================================================"
    echo ""
    echo -e "${YELLOW}🏗️  Arquitectura:${NC}"
    echo "   • ASP.NET Core 8.0 + Blazor Server"
    echo "   • Prometheus para métricas"
    echo "   • Grafana para dashboards"
    echo "   • AlertManager para gestión de alertas"
    echo "   • Docker Compose para orquestación"
    echo ""
    echo -e "${YELLOW}🔧 Características:${NC}"
    echo "   • Dashboard interactivo en tiempo real"
    echo "   • Simuladores de carga integrados"
    echo "   • Sistema de alertas con webhooks"
    echo "   • API REST para integración"
    echo "   • UI moderna con Bootstrap 5"
    echo ""
    echo -e "${YELLOW}🌐 Puertos utilizados:${NC}"
    echo "   • 8000: Aplicación .NET Demo"
    echo "   • 9090: Prometheus"
    echo "   • 3000: Grafana"
    echo "   • 9093: AlertManager"
    echo "   • 9100: Node Exporter"
    echo "   • 8080: cAdvisor"
    echo ""
    echo -e "${YELLOW}📁 Estructura del proyecto:${NC}"
    echo "   prometheus-grafana-dotnet/"
    echo "   ├── demo-app/              # Aplicación .NET + Blazor"
    echo "   ├── prometheus/            # Configuración Prometheus"
    echo "   ├── grafana/               # Dashboards Grafana"
    echo "   ├── alertmanager/          # Configuración AlertManager"
    echo "   └── docker-compose.yml     # Orquestación de servicios"
}

# Menú principal
while true; do
    echo ""
    echo -e "${BLUE}🎯 Selecciona una opción:${NC}"
    echo "1) Verificar demo app .NET"
    echo "2) Generar requests (activar alertas)"
    echo "3) Simular carga (CPU/memoria)"
    echo "4) Probar webhook manualmente"
    echo "5) Mostrar estado actual"
    echo "6) Prueba completa automatizada"
    echo "7) Abrir dashboard de alertas"
    echo "8) Mostrar información del proyecto"
    echo "0) Salir"
    
    read -p "Opción: " choice
    
    case $choice in
        1) check_demo_app ;;
        2) generate_load ;;
        3) simulate_load ;;
        4) test_webhook ;;
        5) show_status ;;
        6) full_test ;;
        7) open_alerts_dashboard ;;
        8) show_project_info ;;
        0) echo -e "${GREEN}👋 ¡Hasta luego!${NC}"; exit 0 ;;
        *) echo -e "${RED}❌ Opción no válida${NC}" ;;
    esac
done
```

## 🚀 Despliegue y Ejecución

### Paso 1: Clonar y Ejecutar

```bash
# Clonar el proyecto
git clone <repository-url>
cd prometheus-grafana-dotnet

# Ejecutar todos los servicios
docker compose up --build -d

# Verificar que todos los servicios estén corriendo
docker compose ps
```

### Paso 2: Verificar el Sistema

```bash
# Probar la aplicación
curl http://localhost:8000/health

# Ejecutar script de pruebas
chmod +x test-webhook-dotnet.sh
./test-webhook-dotnet.sh
```

### Paso 3: Acceder a los Dashboards

- **Aplicación Demo**: http://localhost:8000
- **Dashboard de Alertas**: http://localhost:8000/alerts  
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)
- **AlertManager**: http://localhost:9093

## 📊 Métricas y Alertas

### Métricas Disponibles

La aplicación expone las siguientes métricas a Prometheus:

```promql
# Requests HTTP por método y endpoint
http_requests_total{method="GET", endpoint="/api/data"}

# Uso de memoria en bytes
memory_usage_bytes

# Porcentaje de CPU
cpu_usage_percent

# Duración de requests
http_request_duration_seconds
```

### Alertas Configuradas

1. **HighCPUUsage**: CPU > 80% por más de 1 minuto
2. **HighMemoryUsage**: Memoria > 400MB por más de 2 minutos  
3. **HighRequestRate**: Más de 10 req/s por más de 30 segundos

## 🎯 Casos de Uso

### Entornos de Desarrollo
- **Testing de alertas** antes de producción
- **Prototipado rápido** de dashboards
- **Validación** de métricas personalizadas

### Entornos de Producción
- **Monitoreo 24/7** de aplicaciones
- **Alertas proactivas** para prevenir incidentes
- **Dashboards ejecutivos** para métricas de negocio

### DevOps y SRE
- **Observabilidad completa** del stack
- **Troubleshooting** con métricas históricas
- **Capacity planning** basado en tendencias

## Conclusión

Has aprendido a construir un sistema completo de monitoreo empresarial utilizando tecnologías modernas de .NET y herramientas open source. Este stack te proporciona:

- **Aplicaciones interactivas** con Blazor Server
- **Métricas en tiempo real** con Prometheus
- **Alertas inteligentes** con AlertManager
- **Visualización avanzada** con Grafana
- **Despliegue simplificado** con Docker

**Beneficios del enfoque:**
- Escalabilidad y rendimiento con .NET 8
- UI moderna y reactiva con Blazor
- Integración nativa con ecosistema Prometheus
- Facilidad de despliegue con contenedores
- Flexibilidad para personalización

¡Experimenta con diferentes métricas, crea tus propios dashboards y adapta el sistema a las necesidades específicas de tu organización! 🚀
