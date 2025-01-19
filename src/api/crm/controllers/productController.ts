import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ErrorHandler from "../../../utils/ErrorHandler";
import ProductService from "../../../services/crm/productService";
class ProductController {
  constructor(private productService: ProductService) {}
  add_new_product = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      const files = req.files;

      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      const product = await this.productService.add_new_product(
        req.body,
        files,
        user,
        next
      );
    
      if (product) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
  update = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      const files = req.files;
      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      const product = await this.productService.update(
        req.body,
        files,
        user,
        next
      );
      if (product) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;

      const resultPerpage = Number(query.rowsPerPage);

      const product = await this.productService.all(query);
      
      const data_counter = await this.productService.data_counter(query);
      if (product) {
        return res.status(201).json({
          success: true,
          product,
          resultPerpage,
          data_counter,
        });
      }
    }
  );
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const product = await this.productService.find_by_id(id, next);

      if (product) {
        return res.status(201).json({
          success: true,
          product,
        });
      }
    }
  );
  remove = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const data: any = req.body;
      console.log(data);

      const categorie = await this.productService.find_by_id_and_update(
        id,
        data,
        next
      );
      if (categorie) {
        return res.status(200).json({
          succes: true,
        });
      }
    }
  );
}
export default ProductController;
