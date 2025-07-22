---
title: Cómo Instalar y Configurar Sudo en un Servidor con Debian
excerpt: En Debian, sudo es una herramienta vital que permite a los usuarios ejecutar comandos con privilegios de administrador de manera controlada. Aprende a instalarlo y configurarlo paso a paso.
publishDate: 'January 22 2025'
tags:
  - Linux
  - Debian
  - DevOps
  - Administración de sistemas
seo:
  image:
    src: '/post-2.jpg'
    alt: Terminal de Linux mostrando comandos sudo
---

![Terminal de Linux mostrando comandos sudo](/post-2.jpg)

En Debian, **sudo** es una herramienta vital que permite a los usuarios ejecutar comandos con privilegios de administrador de manera controlada. Si eres nuevo en Debian o necesitas agregar un usuario al grupo de sudo, este tutorial te guiará paso a paso en el proceso de instalación y configuración.

## ¿Por qué Necesitamos sudo?

En sistemas Linux, sudo permite ejecutar tareas administrativas sin necesidad de acceder directamente a la cuenta de superusuario (root). Esto es útil por razones de seguridad, ya que limita el acceso a comandos sensibles a solo los usuarios que necesitan esos permisos.

Si estás utilizando Debian y solo has intalado el sistema base no tienes configurado sudo en tu sistema, o si deseas agregar tu usuario al grupo de sudo para tener acceso administrativo, sigue estos sencillos pasos.

## Paso 1: Deshabilitar el repositorio del CD-ROM

Puedes hacerlo ejecutando el siguiente comando, que deshabilita cualquier entrada relacionada con el CD-ROM sin necesidad de editar el archivo sources.list manualmente.

```bash
su -c "sed -i '/cdrom:/s/^/#/' /etc/apt/sources.list"
```

## Paso 2: Instalar sudo

Para empezar, asegúrate de que sudo esté instalado en tu sistema Debian. Si no lo está, puedes instalarlo fácilmente usando el siguiente comando en la terminal.

Abre una terminal e ingresa como usuario root o como un usuario con privilegios administrativos.

Si ya tienes acceso como root, simplemente omite el paso de sudo y usa el siguiente comando para instalar sudo:

```bash
su -c "apt update && apt install sudo passwd"
```

Si ya tienes instalado sudo en tu cuenta, simplemente puedes ejecutar:

```bash
sudo apt update && sudo apt install sudo passwd
```

Esto actualizará los repositorios y procederá con la instalación del paquete sudo.

## Paso 3: Agregar un Usuario al Grupo sudo

Una vez que hayas instalado sudo, el siguiente paso es agregar tu usuario al grupo sudo para que puedas ejecutar comandos con privilegios elevados:


```bash
su -c "/usr/sbin/usermod -aG sudo $USER"
```

Este comando agrega tu usuario actual al grupo sudo sin eliminarlo de otros grupos a los que ya pertenece.


Una vez que hayas agregado el usuario, deberás **cerrar sesión y volver a iniciarla** para que los cambios tengan efecto.

## Paso 4: Verificar que el Usuario Está en el Grupo sudo

Para confirmar que tu usuario ha sido agregado correctamente al grupo sudo, puedes ejecutar el siguiente comando:

```bash
groups $USER
```

Este comando te mostrará todos los grupos a los que pertenece tu usuario. Si todo está correcto, `sudo` aparecerá en la lista.

## Paso 5: Probar sudo

Finalmente, puedes probar que sudo funciona correctamente ejecutando un comando simple que requiera privilegios de administrador. Por ejemplo:

```bash
newgrp sudo
sudo whoami
```

El comando anterior debería devolver `root`, lo que indica que tienes privilegios de administrador.

### Resumen de comandos:

```bash
su -c "sed -i '/cdrom:/s/^/#/' /etc/apt/sources.list"
su -c "apt update && apt install sudo passwd"
su -c "/usr/sbin/usermod -aG sudo $USER"
groups $USER
newgrp sudo
sudo whoami
```