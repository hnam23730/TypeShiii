import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Catergory";


class ProductController {
    static async list(req: Request, res: Response) {
        try {
            // Fetch products with their categories
            const products = await AppDataSource.getRepository(Product).find({
                relations: ["category"], // Include the category relation
            });

            // Render the product list view
            res.render("products/list.ejs", { products });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showCreateForm(req: Request, res: Response) {
        const categories = await AppDataSource.getRepository(Category).find();
        res.render("products/create.ejs", { categories });
    }

    static async listByCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
    
        // Fetch products by category ID
        const products = await AppDataSource.getRepository(Product).find({
            where: { category: { id: categoryId } },
            relations: ["category"], // Ensure the category relation is loaded
        });
    
        res.render("products/list.ejs", { products });
    }

    static async create(req: Request, res: Response) {
        const { name, description, price, imageUrl, availability, height, shippingDetails, category } = req.body;

        const product = new Product();
        product.name = name;
        product.description = description;
        product.price = parseFloat(price);
        product.imageUrl = imageUrl;
        product.availability = availability;
        product.height = height ? parseFloat(height) : 0;
        product.shippingDetails = shippingDetails;

        if (category) {
            const categoryEntity = await AppDataSource.getRepository(Category).findOneBy({ id: parseInt(category) });
            product.category = categoryEntity || null;
        }

        await AppDataSource.getRepository(Product).save(product);
        res.redirect("/products");
    }
    static async showEditForm(req: Request, res: Response) {
        const product = await AppDataSource.getRepository(Product).findOneBy({ id: Number(req.params.id) });
        const categories = await AppDataSource.getRepository(Category).find();
        res.render("products/edit.ejs", { product, categories });
    }

    static async update(req: Request, res: Response) {
        const { name, description, price, imageUrl, availability, height, shippingDetails, category } = req.body;

        const productData: Partial<Product> = {
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            availability,
            height: height ? parseFloat(height) : 0,
            shippingDetails,
        };

        if (category) {
            const categoryEntity = await AppDataSource.getRepository(Category).findOneBy({ id: parseInt(category) });
            productData.category = categoryEntity || null;
        }

        await AppDataSource.getRepository(Product).update(req.params.id, productData);
        res.redirect("/products");
    }

    static async delete(req: Request, res: Response) {
        await AppDataSource.getRepository(Product).delete(req.params.id);
        res.redirect("/products");
    }
}

export default ProductController;