import { Request, Response } from "express";
import { AppDataSource } from "@database/data-source";
import { Order } from "@entities/orders";
import { sendEmail } from "@services/email.service";

export class OrderController {
    static async list(req: Request, res: Response) {
        try {
            const orders = await AppDataSource.getRepository(Order).find({
                order: { createdAt: "DESC" }, // Sắp xếp theo thời gian tạo
            });
            res.render("order/list.ejs", { orders });
        } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async update(req: Request, res: Response) {
        const { orderIds, statuses } = req.body;

        for (let i = 0; i < orderIds.length; i++) {
            const orderId = orderIds[i];
            const status = statuses[i];

            const order = await AppDataSource.getRepository(Order).findOneBy({ id: parseInt(orderId) });
            if (order) {
                if (status === "Delivered") {
                    // Gửi email thông báo giao hàng thành công
                    await sendEmail(
                        order.customerEmail,
                        "Order Delivered Successfully",
                        `<p>Dear ${order.customerName},</p><p>Your order has been successfully delivered!</p>`
                    );

                    // Xóa đơn hàng khỏi cơ sở dữ liệu
                    await AppDataSource.getRepository(Order).delete(order.id);
                } else {
                    // Cập nhật trạng thái đơn hàng nếu không phải "Delivered"
                    order.status = status;
                    await AppDataSource.getRepository(Order).save(order);
                }
            }
        }

        res.redirect("/order");
    }
}