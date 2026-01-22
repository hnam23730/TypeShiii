import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "../database/data-source";
import { Review } from "../entities/Review";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { NotificationService } from '../services/notification.service';

class ReviewController {

    // Gửi đánh giá mới cho sản phẩm
    static async submitReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, rating, comment } = req.body;
            const userLogin = (req.session as any).userLogin;

            if (!userLogin) {
                res.status(401).json({ success: false, message: "Bạn cần đăng nhập để gửi đánh giá." });
                return;
            }

            if (!productId || !rating || rating < 1 || rating > 5) {
                res.status(400).json({ success: false, message: "Thông tin đánh giá không hợp lệ (productId hoặc rating)." });
                return;
            }

            const product = await AppDataSource.getRepository(Product).findOneBy({ id: parseInt(productId) });
            if (!product) {
                res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
                return;
            }

            const user = await AppDataSource.getRepository(User).findOneBy({ id: userLogin.id });
            if (!user) {
                res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
                return;
            }

            const newReview = new Review(parseInt(rating), comment, user, product);
            await AppDataSource.getRepository(Review).save(newReview);

            // Tạo thông báo cho admin
            await NotificationService.createNewReviewNotification(newReview);

            res.status(201).json({ success: true, message: "Đánh giá của bạn đã được gửi thành công!", review: newReview });

        } catch (error) {
            console.error("Error submitting review:", error);
            next(error);
        }
    }

    // Lấy tất cả đánh giá cho một sản phẩm cụ thể
    static async getReviewsByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = parseInt(Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId);

            if (isNaN(productId)) {
                res.status(400).json({ success: false, message: "ID sản phẩm không hợp lệ." });
                return;
            }

            const reviews = await AppDataSource.getRepository(Review).find({
                where: { product: { id: productId } },
                relations: ["user"], // Load thông tin người dùng đã đánh giá
                order: { createdAt: "DESC" }
            });

            res.status(200).json({ success: true, reviews });

        } catch (error) {
            console.error("Error fetching reviews by product:", error);
            next(error);
        }
    }

    // Admin: Xem tất cả đánh giá
    static async adminListReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviews = await AppDataSource.getRepository(Review).find({
                relations: ["user", "product"], // Load thông tin người dùng và sản phẩm
                order: { createdAt: "DESC" }
            });
            res.render("admin/reviews/list.ejs", { reviews });
        } catch (error) {
            console.error("Error fetching all reviews for admin:", error);
            next(error);
        }
    }

    // Admin: Gửi trả lời cho một đánh giá
    static async submitAdminReply(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviewId = parseInt(Array.isArray(req.params.reviewId) ? req.params.reviewId[0] : req.params.reviewId);
            const { reply } = req.body;
            const userLogin = (req.session as any).userLogin;

            // Kiểm tra quyền admin
            if (!userLogin || userLogin.roleId !== 1) { // Giả sử roleId 1 là Admin
                res.status(403).send("Bạn không có quyền thực hiện hành động này.");
                return;
            }

            if (!reply || reply.trim() === '') {
                // Có thể thêm flash message ở đây nếu dùng
                return res.redirect('/admin/reviews');
            }

            const reviewRepository = AppDataSource.getRepository(Review);
            const review = await reviewRepository.findOneBy({ id: reviewId });

            if (!review) {
                res.status(404).send("Không tìm thấy đánh giá.");
                return;
            }

            review.adminReply = reply;
            review.adminReplyAt = new Date();
            await reviewRepository.save(review);

            res.redirect('/admin/reviews');
        } catch (error) {
            console.error("Error submitting admin reply:", error);
            next(error);
        }
    }
}

export default ReviewController;