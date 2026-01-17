import { Post } from "../entities/Post";
import { AppDataSource } from "../database/data-source";
const postRepository = AppDataSource.getRepository(Post);

class PostService {
    static async getAllPosts(): Promise<any> {
        return await postRepository.find({
            relations: ["category", "auth"]
        });
    }

    static async getPostById(id: number): Promise<Post | null> {
        return await postRepository.findOne({
            where: { id },
            relations: ["category", "auth"]
        });
    }

    static async getPostsByCategory(categoryId: number): Promise<any> {
        return await postRepository.find({
            where: { category: { id: categoryId } },
            relations: ["category", "auth"]
        });
    }

    static async createPost(postData: Partial<Post>): Promise<Post> {
        const post = postRepository.create(postData);
        return await postRepository.save(post);
    }

    static async updatePost(id: number, postData: Partial<Post>): Promise<any> {
        await postRepository.update(id, postData);
        return await postRepository.findOne({
            where: { id },
            relations: ["category", "auth"]
        });
    }

    static async deletePost(id: number): Promise<any> {
        return await postRepository.delete(id);
    }
}

export default PostService;