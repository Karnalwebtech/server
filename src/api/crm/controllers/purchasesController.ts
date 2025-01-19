import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ErrorHandler from "../../../utils/ErrorHandler";
import PurchasesService from "../../../services/crm/purchaeseService";

class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  add_new = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      const files = req.files;

      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      const result = await this.purchasesService.add_new(
        req.body,
        files,
        user,
        next
      );
      if (result) {
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
      const result = await this.purchasesService.update(
        req.body,
        files,
        user,
        next
      );

      // if (result) {
      return res.status(201).json({
        success: true,
      });
      // }
    }
  );
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;

      const resultPerpage = Number(query.rowsPerPage);

      const result = await this.purchasesService.all(query);

      const data_counter = await this.purchasesService.data_counter(query);
      if (result) {
        return res.status(201).json({
          success: true,
          result,
          resultPerpage,
          data_counter,
        });
      }
    }
  );
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.purchasesService.find_by_id(id, next);

      if (result) {
        return res.status(201).json({
          success: true,
          result,
        });
      }
    }
  );
  // remove = AsyncHandler.handle(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const id: string = req.params.id;
  //     const data: any = req.body;
  //     console.log(data);

  //     const categorie = await this.productService.find_by_id_and_update(
  //       id,
  //       data,
  //       next
  //     );
  //     if (categorie) {
  //       return res.status(200).json({
  //         succes: true,
  //       });
  //     }
  //   }
  // );
}
export default PurchasesController;
