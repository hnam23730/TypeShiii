import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";


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
    static async showDetails(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id, 10);

            // Kiểm tra nếu `productId` không hợp lệ
            if (isNaN(productId) || productId < 1) {
                console.error("Invalid product ID:", req.params.id);
                res.status(400).send("Invalid product ID");
                return;
            }

            // Lấy thông tin sản phẩm hiện tại
            const product = await AppDataSource.getRepository(Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.category", "category")
                .where("product.id = :id", { id: productId })
                .getOne();

            if (!product) {
                res.status(404).send("Product not found");
                return;
            }

            // Lấy tối đa 4 sản phẩm cùng danh mục (trừ sản phẩm hiện tại)
            const relatedProducts = await AppDataSource.getRepository(Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.category", "category")
                .where("category.id = :categoryId", { categoryId: product.category?.id })
                .andWhere("product.id != :productId", { productId })
                .take(4)
                .getMany();

            // Render view và truyền dữ liệu
            res.render("frontpage/shop-details.ejs", { product, relatedProducts });
        } catch (error) {
            console.error("Error fetching product details:", error);
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
        const { name, description, price, imageUrl,additionalImages, availability, height, shippingDetails, category } = req.body;

        const product = new Product();
        product.name = name;
        product.description = description;
        product.price = parseFloat(price);
        product.imageUrl = imageUrl;
        product.additionalImages = additionalImages ? JSON.stringify(additionalImages.split(",").map((url: string): string => url.trim())) : "";
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
