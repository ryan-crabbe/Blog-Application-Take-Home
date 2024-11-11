<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('blogs', 'BlogController::index');
$routes->post('blogs', 'BlogController::create');
