<?php

namespace App\Models;

use CodeIgniter\Model;

class BlogModel extends Model 
{
    protected $table = 'blog_posts';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'content',
        'description',
        'image',
        'created_at'
    ];
    
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    
    public function getTopBlogs($page = 1, $limit = 10) 
    {
        try {
            // Ensure page and limit are integers
            $page = max(1, (int)$page);
            $limit = max(1, (int)$limit);
            
            // Calculate offset
            $offset = ($page - 1) * $limit;
            
            // Get total count first
            $total = $this->countAllResults();
            
            // Calculate total pages
            $totalPages = max(1, ceil($total / $limit));
            
            // Get the actual results
            $results = $this->orderBy('id', 'ASC')
                           ->limit($limit, $offset)
                           ->findAll();
            
            return [
                'blog_posts' => $results ?? [],
                'pager' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_posts' => $total
                ]
            ];
        } catch (\Exception $e) {
            log_message('error', 'Error in getTopBlogs: ' . $e->getMessage());
            // Return a safe default response
            return [
                'blog_posts' => [],
                'pager' => [
                    'current_page' => 1,
                    'total_pages' => 1,
                    'total_posts' => 0
                ]
            ];
        }
    }
}
?>
