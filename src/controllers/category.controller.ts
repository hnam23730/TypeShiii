import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

class CategoryController {
    static async list(req: Request, res: Response) {
        try {
            const categories = await AppDataSource.getRepository(Category).find();
            res.render("categories/list.ejs", { categories });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showCreateForm(req: Request, res: Response) {
        res.render("categories/create.ejs");
    }

    static async create(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const category = new Category();
            category.name = name;

            await AppDataSource.getRepository(Category).save(category);
            res.redirect("/categories");
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async showEditForm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rawId = req.params.id;
            const idString = Array.isArray(rawId) ? rawId[0] : rawId;
            if (!idString) {
                res.status(400).send("Invalid category ID");
                return;
            }
            const categoryId = parseInt(idString); // Lấy ID từ URL
            if (isNaN(categoryId)) {
                res.status(400).send("Invalid category ID");
                return;
            }

            const category = await AppDataSource.getRepository(Category).findOneBy({ id: categoryId });

            if (!category) {
                res.status(404).send("Category not found");
                return;
            }

            res.render("categories/edit.ejs", { category }); // Render form chỉnh sửa
        } catch (error) {
            console.error("Error fetching category:", error);
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
        }
    }

    // Xử lý cập nhật danh mục
    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rawId = req.params.id;
            const idString = Array.isArray(rawId) ? rawId[0] : rawId;
            if (!idString) {
                res.status(404).send("Category not found");
                return;
            }
            const categoryId = parseInt(idString);
            const { name } = req.body;

            const category = await AppDataSource.getRepository(Category).findOneBy({ id: categoryId });

            if (!category) {
                res.status(404).send("Category not found");
                return;
            }

            category.name = name;
            await AppDataSource.getRepository(Category).save(category);

            res.redirect("/categories");
        } catch (error) {
            console.error("Error updating category:", error);
            next(error); // Gọi next() để chuyển lỗi đến middleware xử lý lỗi
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const rawId = req.params.id;
            const idString = Array.isArray(rawId) ? rawId[0] : rawId;
            if (!idString) {
                res.status(400).send("Invalid category ID");
                return;
            }
            const categoryId = parseInt(idString);

            // Do `onDelete: 'SET NULL'` trong Product entity,
            // database sẽ tự động cập nhật các sản phẩm liên quan về NULL.
            await AppDataSource.getRepository(Category).delete(categoryId);
    
            res.redirect("/categories");
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

export default CategoryController;