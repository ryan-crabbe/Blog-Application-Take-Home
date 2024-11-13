<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('(:any)', '', ['filter' => 'cors']);
$routes->get('blogs', 'BlogController::index');
$routes->post('blogs', 'BlogController::create');
$routes->get('blogs/(:num)', 'BlogController::show/$1');

$routes->get('uploads/(:any)', static function ($filename) {
    $path = WRITEPATH . 'uploads/' . $filename;
    if (!file_exists($path)) {
        throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
    }
    
    $mime = mime_content_type($path);
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
});
