<?php

namespace App\Controllers;

class BlogController extends BaseController
{
    protected $blogModel;
    
    public function __construct()
    {
        $this->blogModel = new \App\Models\BlogModel();
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
    }
    
    public function index()
    {
        try {
            $page = (int)($this->request->getGet('page') ?? 1);
            $limit = (int)($this->request->getGet('limit') ?? 10);
            
            $data = $this->blogModel->getTopBlogs($page, $limit);
            
            return $this->response->setJSON($data);
        } catch (\Exception $e) {
            log_message('error', 'Error in BlogController::index: ' . $e->getMessage());
            
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal Server Error',
                    'message' => ENVIRONMENT === 'development' ? $e->getMessage() : 'An error occurred'
                ]);
        }
    }
    
    public function create()
    {
        $data = $this->request->getJSON();
        
        if (isset($data->content)) {
            $description = substr($data->content, 0, 50);
            $description .= '...';
            $data->description = $description;
        }
        
        $this->blogModel->insert($data);
        return $this->response->setJSON(['message' => 'Blog created successfully']);
    }
}
