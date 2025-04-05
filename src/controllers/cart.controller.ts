import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";

class CartController {
    // Hiển thị giỏ hàng
    static async viewCart(req: Request, res: Response) {
        const cart = (req.session as any).cart || []; // Lấy giỏ hàng từ session
        let total = 0;

        // Tính tổng số tiền
        cart.forEach((item: any) => {
            total += item.price * item.quantity;
        });

        res.render("frontpage/shoping-cart.ejs", { cart, total });
    }

    // Thêm sản phẩm vào giỏ hàng
    static async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, quantity } = req.body;

            const product = await AppDataSource.getRepository(Product).findOneBy({ id: parseInt(productId) });

            if (!product) {
                res.status(404).send("Product not found");
                return;
            }

            const cart = (req.session as any).cart || []; // Lấy giỏ hàng từ session

            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
            const existingItem = cart.find((item: any) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += parseInt(quantity); // Cập nhật số lượng
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: parseInt(quantity),
                });
            }

            (req.session as any).cart = cart; // Lưu giỏ hàng vào session
            res.redirect("/cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    static removeFromCart(req: Request, res: Response) {
        const { productId } = req.body;
        const cart = (req.session as any).cart || [];

        // Lọc bỏ sản phẩm khỏi giỏ hàng
        (req.session as any).cart = cart.filter((item: any) => item.id !== parseInt(productId));
        res.redirect("/cart");
    }
}

export default CartController;