import { AppDataSource } from "../database/data-source";
import { Notification } from "../entities/Notification";
import { Order } from "../entities/orders";
import { Review } from "../entities/Review";

export class NotificationService {
    static async createNewOrderNotification(order: Order) {
        const notification = new Notification();
        notification.type = 'new_order';
        notification.message = `Đơn hàng mới #${order.id} từ ${order.customerName}.`;
        notification.link = `/order`; // Link to admin order list
        await AppDataSource.getRepository(Notification).save(notification);
    }

    static async createNewReviewNotification(review: Review) {
        const notification = new Notification();
        notification.type = 'new_review';
        // The 'review' object should have the full 'product' loaded from the controller
        notification.message = `Có đánh giá mới cho sản phẩm ${review.product ? review.product.name : 'không xác định'}.`;
        notification.link = `/admin/reviews`; // Link to admin review list
        await AppDataSource.getRepository(Notification).save(notification);
    }
}