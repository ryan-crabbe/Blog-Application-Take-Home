<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('(:any)', '', ['filter' => 'cors']);
$routes->get('blogs', 'BlogController::index');
$routes->post('blogs', 'BlogController::create');
