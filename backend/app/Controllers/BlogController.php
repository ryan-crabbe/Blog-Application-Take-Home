<?php

namespace App\Controllers;

class BlogController extends BaseController
{
    protected $blogModel;
    
    public function __construct()
    {
        $this->blogModel = new \App\Models\BlogModel();
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    
    public function index()
    {
        $page = $this->request->getGet('page') ?? 1;
        $limit = $this->request->getGet('limit') ?? 10;
        
        $data['blog_posts'] = $this->blogModel->getTopBlogs($page, $limit);
        $data['pager'] = $this->blogModel->pager;
        
        return $this->response->setJSON($data);
    }
    
    public function create()
    {
        $data = $this->request->getJSON();
        $this->blogModel->insert($data);
        return $this->response->setJSON(['message' => 'Blog created successfully']);
    }
}
