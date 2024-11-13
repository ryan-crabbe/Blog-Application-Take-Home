<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class BlogController extends ResourceController
{
    use ResponseTrait;
    
    protected $blogModel;
    protected $tagModel;
    protected $db;
    
    public function __construct()
    {
        $this->blogModel = new \App\Models\BlogModel();
        $this->tagModel = new \App\Models\TagModel();
        $this->db = \Config\Database::connect();
        
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    }
    
    public function index()
    {
        try {
            $page = (int)($this->request->getGet('page') ?? 1);
            $limit = (int)($this->request->getGet('limit') ?? 10);
            
            // Get blogs with pagination
            $blogs = $this->blogModel->getTopBlogs($page, $limit);
            
            // Add tags for each blog post
            foreach ($blogs['blog_posts'] as &$blog) {
                $tags = $this->blogModel->getTagsForBlog($blog['id']);
                $blog['tags'] = array_column($tags, 'name');
            }
            
            return $this->response->setJSON($blogs);
            
        } catch (\Exception $e) {
            log_message('error', 'Error fetching blogs: ' . $e->getMessage());
            
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error fetching blogs',
                'error' => ENVIRONMENT === 'development' ? $e->getMessage() : 'Internal server error'
            ]);
        }
    }
    
    public function create()
    {
        try {
            // Start a database transaction
            $this->db->transStart();
            
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
            
            // Insert blog post
            $this->blogModel->insert($jsonData);
            $blogId = $this->blogModel->insertID();
            
            // Debug log
            log_message('debug', 'Blog post created with ID: ' . $blogId);
            
            // Handle tags
            $tags = json_decode($this->request->getPost('tags'), true) ?? [];
            if (!empty($tags)) {
                // Debug log
                log_message('debug', 'Processing tags: ' . json_encode($tags));
                
                $tagIds = $this->tagModel->getOrCreateTags($tags);
                
                // Debug log
                log_message('debug', 'Created tag IDs: ' . json_encode($tagIds));
                
                if (!empty($tagIds)) {
                    $this->blogModel->attachTags($blogId, $tagIds);
                }
            }
            
            // Complete the transaction
            $this->db->transComplete();
            
            if ($this->db->transStatus() === false) {
                // Debug log
                log_message('error', 'Transaction failed');
                throw new \RuntimeException('Failed to create blog post with tags');
            }
            
            // Get the tags for response
            $blogTags = $this->blogModel->getTagsForBlog($blogId);
            $jsonData['tags'] = array_column($blogTags, 'name');
            
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
    
    public function show($id = null)
    {
        try {
            if ($id === null) {
                return $this->response->setStatusCode(400)->setJSON([
                    'message' => 'Blog ID is required'
                ]);
            }

            $blog = $this->blogModel->find($id);
            
            if (!$blog) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Blog post not found'
                ]);
            }
            
            // Get tags for the blog post
            $tags = $this->blogModel->getTagsForBlog($blog['id']);
            $blog['tags'] = array_column($tags, 'name');
            
            return $this->response->setJSON([
                'blog_post' => $blog
            ]);
            
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error fetching blog post',
                'error' => ENVIRONMENT === 'development' ? $e->getMessage() : 'Internal server error'
            ]);
        }
    }
}
