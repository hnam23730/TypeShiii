import serverless from 'serverless-http';
import { Express } from 'express';
import { appPromise } from './../src/index';

// Lưu lại promise của handler để không phải tạo lại mỗi lần gọi
const handlerPromise = appPromise.then((app: Express) => serverless(app));

// Hàm handler chính cho Netlify
export const handler = async (event: any, context: any) => {
  // Chờ cho handler được tạo xong
  const serverlessHandler = await handlerPromise;
  // Thực thi request
  return serverlessHandler(event, context);
};