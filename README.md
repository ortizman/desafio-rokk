# desafio-rokk

## Clonar el repo

```
git clone https://github.com/ortizman/desafio-rokk.git
```

## Base de datos
> Warning: Por comodidad en las pruebas, las tablas se regeneran cada vez que se levanta la app.

* Crear base de datos en MySQL 5.5+ con nombre: shop
* Usuario y password de la base se configura en server/datasource.json
* Por defecto el user y pass: root/root

# Levantar el backend
```
node .
 ```
 > La creación de tablas se hace automatica cuando se levanta el server

## Endpoints
* {HOST:PORT}/api/Customers
* {HOST:PORT}/api/Products

> Ejemplo si levantan la API Rest local
* http://localhost:3000/api/Customers
* http://localhost:3000/api/Products

## URL a collection de postman
A continuacion se incluye una collection de postman con ejemplos de invocaciones:
* Crear y obtener un cliente
* Crear y obtener un producto. Obtener todos los productos
* Crear una orden de compra al cliente
* Agregar un item a la orden del cliente
* Agregar un producto al item de la Orden.
* Obtener todos los items de la orden (cantidad de productos en el carrito)
* Incrementar/decrementar un producto exitente en la orden. Esto se hace de forma atomica (transaccional)

https://www.getpostman.com/collections/1db156d280c9d1f915c5

## URL a Swagger
Desde swagger se pueden hacer todas las pruebas correspondientes

* http://localhost:3000/explorer/#/

