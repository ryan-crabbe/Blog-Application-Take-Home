const API_URL = 'http://localhost:8080';

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    description: string;
    created_at: string;
    image: string;
    tags: string[];
}

export interface BlogResponse {
    blog_posts: BlogPost[];
    pager: {
        current_page: number;
        total_pages: number;
        total_posts: number;
    };
}

export async function fetchBlogs(page: number = 1, limit: number = 10): Promise<BlogResponse> {
    try {
        const response = await fetch(`${API_URL}/blogs?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
}

export async function fetchBlogPost(id: number): Promise<BlogPost> {
    try {
        const response = await fetch(`${API_URL}/blogs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        return data.blog_post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
    }
} 