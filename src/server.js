"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var middleware_1 = require("../middleware"); // Aquí importamos el middleware
var node_1 = require("@angular/ssr/node");
var serverDistFolder = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
var browserDistFolder = (0, node_path_1.resolve)(serverDistFolder, '../browser');
var app = (0, express_1.default)();
var angularApp = new node_1.AngularNodeAppEngine();
// Usar el middleware para proteger las rutas necesarias
app.use(middleware_1.default); // O app.use('/api', middleware);
// Ruta de login
app.post('/login', function (req, res) {
    // Lógica de autenticación
});
// Ruta de verificación de token
app.post('/verifyToken', function (req, res) {
    // Lógica para verificar el token
});
/**
 * Servir los archivos estáticos de la aplicación Angular
 */
app.use(express_1.default.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
}));
/**
 * Manejar las demás peticiones con Angular SSR
 */
app.use('/**', function (req, res, next) {
    angularApp
        .handle(req)
        .then(function (response) {
        return response ? (0, node_1.writeResponseToNodeResponse)(response, res) : next();
    })
        .catch(next);
});
/**
 * Iniciar el servidor
 */
var port = process.env['PORT'] || 4000;
app.listen(port, function () {
    console.log("Node Express server listening on http://localhost:".concat(port));
});
