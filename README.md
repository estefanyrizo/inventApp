# Aplicación de Inventario - Angular  

Este proyecto es una aplicación web para la gestión de inventario de productos, desarrollada en *Angular. Cuenta con autenticación mediante **JWT*, control de permisos y funcionalidades CRUD para usuarios, categorías y productos.  

La API ya está implementada de forma remota, pero si se desea probar la aplicación con una API local, se puede hacer con *JSON Server*.  

## 📌 Funcionalidades principales  

### 🔹 Autenticación y seguridad  
- Inicio de sesión con validación de credenciales.  
- Se almacena el *token JWT* en *localStorage* para mantener la sesión activa.  
- Mensajes de alerta en caso de credenciales incorrectas.  
- Control de acceso según el rol del usuario.  

### 🔹 Gestión de usuarios  
- Solo los administradores pueden agregar nuevos usuarios.  
- Posibilidad de cambiar el rol de un usuario (admin/usuario).  
- Los usuarios sin permisos de administrador no pueden ver la lista de usuarios.  

### 🔹 Gestión de categorías y productos  
- *CRUD completo*: ver, crear y editar categorías y productos.  
- Solo los administradores pueden editar categorías o productos.  
---

## 🚀 Instalación y ejecución  

### 1️⃣ Requisitos previos  
Para ejecutar el proyecto, se necesita:  

- *Node.js* >=16.14.0  
- *Angular CLI* >=15  

### 2️⃣ Clonar el repositorio  

sh
git clone https://github.com/estefanyrizo/inventApp.git

### 3️⃣ Instalar dependencias  

sh
npm install


### 4️⃣ Ejecutar la aplicación  

sh
ng serve


La aplicación estará disponible en http://localhost:4200/.  

---

## 📌 Uso de API remota o local  

Por defecto, la aplicación usa la API remota. Sin embargo, si se quiere probar con una API local usando *JSON Server*, se puede hacer con el siguiente comando:  

sh
json-server --watch db.json --middlewares ./middlewares.js --port 3000


Luego, solo hay que cambiar la ruta de los servicios en el código, reemplazando la URL de la API remota por:  


http://localhost:3000


---

## 📂 Estructura del Proyecto  


inventario-angular/
│── src/
│   ├── app/
│   │   ├── auth/  # Autenticación y control de permisos
│   │   ├── usuario/ # Gestión de usuarios
│   │   ├── producto/ # Gestión de productos
│   │   ├── categorias # Gestión de categorías
│── db.json  # Base de datos local para JSON Server
│── angular.json
│── package.json


---

## 📌 Notas Finales  

- Se implementaron mensajes de notificación para cada acción.  
- Se uso *PrimeNG, **TailwindCSS* para el diseño.
