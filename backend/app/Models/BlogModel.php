<?php

namespace App\Models;

use CodeIgniter\Model;

class BlogModel extends Model 
{
    protected $table = 'blog_posts';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'description', 'content', 'category', 'created_at', 'image'];
    
    public function getTopBlogs($page = 1, $limit = 10) 
    {
        return $this->orderBy('id', 'DESC')
                    ->paginate($limit, 'default', $page);
    }
}
?>
