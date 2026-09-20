<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

// API Eleições 2026 (JSON) — multi-cargo: presidente, governador, senador, dep-federal, dep-estadual
$routes->group('api', ['filter' => 'cors'], static function ($routes) {
    $routes->options('(:any)', static function () {
        return response()->setStatusCode(204);
    });
    $routes->get('candidatos', 'Api\Candidatos::index');
    $routes->get('candidatos/(:segment)', 'Api\Candidatos::show/$1');
    $routes->get('candidatos/(:segment)/bens', 'Api\Candidatos::bens/$1');
    $routes->get('rankings/patrimonio', 'Api\Rankings::patrimonio');
    $routes->get('rankings/receitas', 'Api\Rankings::receitas');
    $routes->get('estatisticas', 'Api\Estatisticas::index');
    $routes->post('coletas', 'Api\Coletas::importar');
});
