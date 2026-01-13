import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";

class WishlistController {
    // Hiển thị danh sách yêu thích
    static async viewWishlist(req: Request, res: Response) {
        const wishlist = (req.session as any).wishlist || []; // Lấy danh sách yêu thích từ session
        res.render('frontpage/wishlist', { wishlist });
    }

    // Thêm sản phẩm vào danh sách yêu thích
    static async addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.body;
    
            const product = await AppDataSource.getRepository(Product).findOneBy({ id: parseInt(productId) });
    
            if (!product) {
                res.status(404).json({ success: false, message: "Product not found" });
                return;
            }
    
            const wishlist = (req.session as any).wishlist || []; // Lấy danh sách yêu thích từ session
    
            // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách yêu thích
            const existingItem = wishlist.find((item: any) => item.id === product.id);
            if (!existingItem) {
                // Thêm sản phẩm mới vào danh sách yêu thích
                wishlist.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                });
            }
    
            (req.session as any).wishlist = wishlist; // Lưu danh sách yêu thích vào session
            res.json({ success: true, message: "Product added to wishlist" });
       
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
        }
    }
    static async buyFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.body;

            // Lấy danh sách yêu thích từ session
            const wishlist = (req.session as any).wishlist || [];
            const productIndex = wishlist.findIndex((item: any) => item.id === parseInt(productId));

            if (productIndex === -1) {
                res.status(404).json({ success: false, message: "Product not found in wishlist" });
                return;
            }

            // Lấy sản phẩm từ wishlist
            const product = wishlist[productIndex];

            // Xóa sản phẩm khỏi wishlist
            wishlist.splice(productIndex, 1);
            (req.session as any).wishlist = wishlist;

            // Thêm sản phẩm vào giỏ hàng
            const shopingCart = (req.session as any).shopingCart || []; // SỬA LỖI: Dùng `shopingCart`
            const existingItem = shopingCart.find((item: any) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1; // Tăng số lượng nếu sản phẩm đã tồn tại trong giỏ hàng
            } else {
                shopingCart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                });
            }
            (req.session as any).shopingCart = shopingCart; // SỬA LỖI: Lưu lại vào `shopingCart`

            res.redirect('/shoping-cart'); // Chuyển hướng đến trang giỏ hàng
        } catch (error) {
            console.error("Error buying product from wishlist:", error);
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
        }
    }
    // Xóa sản phẩm khỏi danh sách yêu thích
    static removeFromWishlist(req: Request, res: Response) {
        const { productId } = req.body;
        const wishlist = (req.session as any).wishlist || [];

        // Lọc bỏ sản phẩm khỏi danh sách yêu thích
        (req.session as any).wishlist = wishlist.filter((item: any) => item.id !== parseInt(productId));
        res.redirect("/wishlist");
    }
}

export default WishlistController;