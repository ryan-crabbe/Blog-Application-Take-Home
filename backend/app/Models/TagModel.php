<?php

namespace App\Models;

use CodeIgniter\Model;

class TagModel extends Model
{
    protected $table = 'tags';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = ['name'];
    protected $useTimestamps = false;

    public function getOrCreateTags(array $tagNames): array
    {
        $tagIds = [];
        foreach ($tagNames as $tagName) {
            $tag = $this->where('name', $tagName)->first();
            if (!$tag) {
                $this->insert(['name' => $tagName]);
                $tagIds[] = $this->insertID();
            } else {
                $tagIds[] = $tag['id'];
            }
        }
        return $tagIds;
    }
}
