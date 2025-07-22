---
title: Guía Completa de Instalación y Uso Básico de Docker en un Servidor Debian
excerpt: Docker es una plataforma de contenedores que te permite empaquetar y distribuir aplicaciones junto con sus dependencias en un entorno aislado y portátil. Aprende a instalarlo y usar los comandos más importantes.
publishDate: 'January 24 2025'
tags:
  - Docker
  - Debian
  - DevOps
  - Contenedores
  - Linux
seo:
  image:
    src: '/post-3.jpg'
    alt: Docker containers en un servidor Linux
---

![Docker containers en un servidor Linux](/post-3.jpg)

Docker es una plataforma de contenedores que revoluciona la forma en que desarrollamos, desplegamos y ejecutamos aplicaciones. Te permite **empaquetar aplicaciones junto con sus dependencias** en un entorno aislado y portátil, garantizando que funcionen de manera consistente en cualquier sistema.

En esta guía completa, aprenderás a **instalar Docker en un servidor Debian** desde cero y dominarás los **comandos más importantes** para trabajar con contenedores de manera eficiente.

## ¿Por qué usar Docker?

Antes de sumergirnos en la instalación, es importante entender las ventajas que Docker ofrece:

- **Portabilidad**: Las aplicaciones funcionan igual en desarrollo, testing y producción
- **Escalabilidad**: Fácil escalado horizontal de servicios
- **Aislamiento**: Cada contenedor es independiente y seguro
- **Eficiencia**: Menor consumo de recursos comparado con máquinas virtuales
- **Consistencia**: "Funciona en mi máquina" ya no es un problema

## 📦 Instalación de Docker en Debian

### Paso 1: Desinstalar Versiones Anteriores

Antes de instalar Docker Engine, debemos eliminar cualquier paquete conflictivo que pueda existir en el sistema:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do 
    sudo apt-get remove $pkg
done
```

Este comando elimina las versiones no oficiales de Docker que podrían interferir con la instalación oficial.

### Paso 2: Configurar el Repositorio Oficial de Docker

Para garantizar que instalemos la versión más reciente y segura, configuraremos el repositorio oficial de Docker:

```bash
# Actualizar índice de paquetes
sudo apt-get update

# Instalar dependencias necesarias
sudo apt-get install ca-certificates curl

# Crear directorio para las claves GPG
sudo install -m 0755 -d /etc/apt/keyrings

# Descargar la clave GPG oficial de Docker
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc

# Establecer permisos correctos para la clave
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Ahora agregamos el repositorio a las fuentes de APT:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar índice con el nuevo repositorio
sudo apt-get update
```

### Paso 3: Instalar Docker Engine

Ahora instalamos Docker y todos sus componentes:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Componentes instalados:**
- `docker-ce`: Docker Engine
- `docker-ce-cli`: Cliente de línea de comandos
- `containerd.io`: Runtime de contenedores
- `docker-buildx-plugin`: Constructor avanzado de imágenes
- `docker-compose-plugin`: Herramienta para aplicaciones multi-contenedor

### Paso 4: Configurar Usuario sin Privilegios Root

Para mayor seguridad y comodidad, configuramos Docker para funcionar sin `sudo`:

```bash
# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios de grupo sin reiniciar sesión
newgrp docker

# Verificar que funciona correctamente
docker ps && docker --version
```

## 🚀 Comandos Básicos de Docker

### Gestión del Servicio Docker

```bash
# Verificar estado del servicio
sudo systemctl status docker

# Iniciar Docker (si está detenido)
sudo systemctl start docker

# Habilitar inicio automático
sudo systemctl enable docker

# Reiniciar el servicio
sudo systemctl restart docker
```

### Trabajando con Contenedores

#### Ver Contenedores

```bash
# Contenedores en ejecución
docker ps

# Todos los contenedores (incluidos detenidos)
docker ps -a

# Mostrar solo IDs de contenedores
docker ps -q
```

#### Ejecutar Contenedores

```bash
# Ejecutar contenedor básico
docker run hello-world

# Ejecutar en modo interactivo
docker run -it ubuntu:20.04 /bin/bash

# Ejecutar en segundo plano
docker run -d --name mi-servidor nginx

# Ejecutar con mapeo de puertos
docker run -d -p 8080:80 --name mi-web nginx
```

#### Gestionar Contenedores

```bash
# Detener contenedor
docker stop mi-contenedor

# Iniciar contenedor detenido
docker start mi-contenedor

# Reiniciar contenedor
docker restart mi-contenedor

# Eliminar contenedor
docker rm mi-contenedor

# Eliminar contenedor en ejecución (forzado)
docker rm -f mi-contenedor
```

### Trabajando con Imágenes

#### Gestión de Imágenes

```bash
# Listar imágenes locales
docker images

# Descargar imagen sin ejecutar
docker pull ubuntu:20.04

# Buscar imágenes en Docker Hub
docker search nginx

# Eliminar imagen
docker rmi ubuntu:20.04

# Eliminar imágenes no utilizadas
docker image prune
```

#### Crear Imágenes Personalizadas

**Ejemplo de Dockerfile:**

```dockerfile
# Usar imagen base oficial
FROM node:16-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Usuario no privilegiado
USER node

# Comando por defecto
CMD ["npm", "start"]
```

**Construir imagen:**

```bash
# Construir imagen con tag
docker build -t mi-app:1.0 .

# Construir con contexto específico
docker build -t mi-app:latest -f Dockerfile.prod .
```

#### Etiquetar Imágenes

```bash
# Crear nueva etiqueta
docker tag mi-app:1.0 mi-app:latest

# Etiquetar para registry
docker tag mi-app:1.0 registry.ejemplo.com/mi-app:1.0
```

### Monitoreo y Debugging

#### Logs y Información

```bash
# Ver logs de contenedor
docker logs mi-contenedor

# Seguir logs en tiempo real
docker logs -f mi-contenedor

# Logs con timestamps
docker logs -t mi-contenedor

# Información detallada del contenedor
docker inspect mi-contenedor

# Estadísticas de uso de recursos
docker stats

# Procesos ejecutándose en contenedor
docker top mi-contenedor
```

#### Acceso a Contenedores

```bash
# Ejecutar comando en contenedor activo
docker exec -it mi-contenedor bash

# Ejecutar comando específico
docker exec mi-contenedor ls -la /app

# Copiar archivos hacia/desde contenedor
docker cp archivo.txt mi-contenedor:/app/
docker cp mi-contenedor:/app/logs.txt ./
```

## 🛠️ Comandos de Mantenimiento

### Limpieza del Sistema

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa del sistema
docker system prune -a

# Ver uso de espacio en disco
docker system df
```

### Networking

```bash
# Listar redes
docker network ls

# Crear red personalizada
docker network create mi-red

# Conectar contenedor a red
docker network connect mi-red mi-contenedor

# Inspeccionar red
docker network inspect mi-red
```

## 📋 Ejemplo Práctico: Aplicación Web Simple

Vamos a crear y ejecutar una aplicación web completa:

```bash
# 1. Crear directorio de trabajo
mkdir mi-app-web && cd mi-app-web

# 2. Crear archivo HTML simple
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Mi App Docker</title>
</head>
<body>
    <h1>¡Hola desde Docker!</h1>
    <p>Esta aplicación se ejecuta en un contenedor Docker.</p>
</body>
</html>
EOF

# 3. Crear Dockerfile
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
EOF

# 4. Construir imagen
docker build -t mi-web-app .

# 5. Ejecutar contenedor
docker run -d -p 8080:80 --name mi-web mi-web-app

# 6. Verificar que funciona
curl http://localhost:8080
```

## 🚨 Troubleshooting Común

### Problemas de Permisos

```bash
# Si aparece "permission denied"
sudo chmod 666 /var/run/docker.sock

# O reagregar usuario al grupo
sudo usermod -aG docker $USER
newgrp docker
```

### Contenedores que no Inician

```bash
# Verificar logs detallados
docker logs --details mi-contenedor

# Revisar configuración
docker inspect mi-contenedor
```

### Problemas de Red

```bash
# Verificar conectividad
docker exec mi-contenedor ping google.com

# Revisar configuración de red
docker network inspect bridge
```

## 🎯 Mejores Prácticas

1. **Usa imágenes oficiales** como base siempre que sea posible
2. **Mantén las imágenes pequeñas** usando Alpine Linux o distroless
3. **No ejecutes como root** dentro de contenedores
4. **Usa .dockerignore** para excluir archivos innecesarios
5. **Etiqueta las imágenes** de manera descriptiva con versioning semántico
6. **Limpia regularmente** contenedores e imágenes no utilizados
7. **Usa variables de entorno** para configuración
8. **Implementa health checks** en tus contenedores

## Conclusión

Docker es una herramienta fundamental en el ecosistema DevOps moderno. Con esta guía, tienes las bases sólidas para comenzar a trabajar con contenedores de manera eficiente y segura.

**Próximos pasos recomendados:**
- Explora Docker Compose para aplicaciones multi-contenedor
- Aprende sobre Docker Swarm o Kubernetes para orquestación
- Implementa registries privados para tus imágenes
- Automatiza builds con CI/CD pipelines

¡Continúa experimentando y construyendo aplicaciones increíbles con Docker! 🐳
