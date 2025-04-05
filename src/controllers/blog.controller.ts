import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Blog } from "../entities/Blog";

class BlogController {
    static async list(req: Request, res: Response) {
        try {
            const blogs = await AppDataSource.getRepository(Blog).find();
            res.render("blogs/list.ejs", { blogs });
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showCreateForm(req: Request, res: Response) {
        res.render("blogs/create.ejs");
    }

    static async create(req: Request, res: Response) {
        try {
            const { title, content, author, categories, tags } = req.body;
            const blog = new Blog();
            blog.title = title;
            blog.content = content;
            blog.author = author;
            blog.categories = categories;
            blog.tags = tags;

            await AppDataSource.getRepository(Blog).save(blog);
            res.redirect("/blogs");
        } catch (error) {
            console.error("Error creating blog:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showEditForm(req: Request, res: Response): Promise<void> {
        try {
            const blog = await AppDataSource.getRepository(Blog).findOneBy({ id: Number(req.params.id) });
            if (!blog) {
                res.status(404).send("Blog not found");
                return;
            }
            res.render("blogs/edit.ejs", { blog });
        } catch (error) {
            console.error("Error fetching blog:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { title, content, author, categories, tags } = req.body;
            await AppDataSource.getRepository(Blog).update(req.params.id, {
                title,
                content,
                author,
                categories,
                tags,
            });
            res.redirect("/blogs");
        } catch (error) {
            console.error("Error updating blog:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await AppDataSource.getRepository(Blog).delete(req.params.id);
            res.redirect("/blogs");
        } catch (error) {
            console.error("Error deleting blog:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

export default BlogController;