import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";

class FrontController {
    static async showFrontPage(req: Request, res: Response) {
        try {
            // Fetch products from the database
            const products = await AppDataSource.getRepository(Product).find({
                order: { id: "DESC" }, // Order by latest products
            });
            const featuredProducts = products.slice(0, 8);
            // Render the front.ejs view and pass the products
            res.render("frontpage/front.ejs", { products });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }
}


export default FrontController;