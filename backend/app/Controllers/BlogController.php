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
        try {
            // Log incoming request data
            log_message('debug', 'Received blog creation request: ' . json_encode([
                'post' => $this->request->getPost(),
                'files' => $this->request->getFiles(),
            ]));
            
            $jsonData = [
                'title' => $this->request->getPost('title'),
                'content' => $this->request->getPost('content'),
            ];
            
            // Handle image upload
            $image = $this->request->getFile('image');
            if ($image) {
                log_message('debug', 'Image details: ' . json_encode([
                    'name' => $image->getName(),
                    'type' => $image->getClientMimeType(),
                    'size' => $image->getSize(),
                    'error' => $image->getError(),
                ]));
                
                if ($image->isValid() && !$image->hasMoved()) {
                    // Ensure upload directory exists
                    $uploadPath = WRITEPATH . 'uploads';
                    if (!is_dir($uploadPath)) {
                        mkdir($uploadPath, 0777, true);
                    }
                    
                    // Generate safe filename
                    $newName = $image->getRandomName();
                    
                    // Move file
                    if ($image->move($uploadPath, $newName)) {
                        $jsonData['image'] = $newName;
                        log_message('debug', 'Image uploaded successfully: ' . $newName);
                    } else {
                        log_message('error', 'Failed to move uploaded file: ' . $image->getErrorString());
                        return $this->response->setStatusCode(500)->setJSON([
                            'error' => 'Failed to save image: ' . $image->getErrorString()
                        ]);
                    }
                } else {
                    log_message('error', 'Invalid image file: ' . $image->getErrorString());
                    return $this->response->setStatusCode(400)->setJSON([
                        'error' => 'Invalid image file: ' . $image->getErrorString()
                    ]);
                }
            }
            
            // Create description
            if (isset($jsonData['content'])) {
                $jsonData['description'] = substr($jsonData['content'], 0, 50) . '...';
            }
            
            // Add timestamp
            $jsonData['created_at'] = date('Y-m-d H:i:s');
            
            // Insert into database
            $this->blogModel->insert($jsonData);
            
            return $this->response->setJSON([
                'message' => 'Blog created successfully',
                'status' => 200,
                'data' => $jsonData
            ]);
            
        } catch (\Exception $e) {
            log_message('error', 'Blog creation error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error creating blog post',
                'error' => ENVIRONMENT === 'development' ? $e->getMessage() : 'Internal server error',
                'trace' => ENVIRONMENT === 'development' ? $e->getTraceAsString() : null
            ]);
        }
    }
}
