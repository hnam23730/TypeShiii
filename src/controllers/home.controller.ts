import WeatherService from "../services/weather.service";
import PostService from "../services/post.service";
import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/orders";
class HomeController {
    static async  index(req: Request, res: Response): Promise<any> {
        // const dataAPI = await WeatherService.getCurrentWeather("Hanoi");
        // const data = dataAPI.data;
        // const temp = Math.floor(data.main.temp - 273);
        // const humidity = data.main.humidity;
        // const windSpeed = data.wind.speed;
        // Lấy danh sách người dùng
        const usersWithOrders = await AppDataSource.getRepository(Order)
                .createQueryBuilder("order")
                .select("COUNT(DISTINCT order.customerEmail)", "count")
                .getRawOne();

        // Lấy danh sách sản phẩm
        const productCount = await AppDataSource.getRepository(Product).count();
        // Lấy tổng số đơn hàng
        const orders = await AppDataSource.getRepository(Order).count();

        // Tính tổng doanh thu
        const totalRevenue = await AppDataSource.getRepository(Order)
            .createQueryBuilder("order")
            .select("SUM(order.total)", "total")
            .getRawOne();

        const posts = await PostService.getAllPosts();
        const users = await AppDataSource.getRepository(User).find({ relations: ["role"] });
        const products = await AppDataSource.getRepository(Product).find();

        res.render('home.ejs', {posts: posts, products: productCount, orders,totalRevenue: totalRevenue.total || 0,users: usersWithOrders.count || 0});
    }
}

export default HomeController;