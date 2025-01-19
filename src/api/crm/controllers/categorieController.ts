import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import CategorieService from "../../../services/crm/categorieService";
import ErrorHandler from "../../../utils/ErrorHandler";
class CategorieController {
  constructor(private categorieService: CategorieService) {}
  add_new_customer = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {  
      const user: string = (req as any).user._id;
      const files = req.files;
      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      const categorie = await this.categorieService.add_new_category(
        req.body,
        files,
        user,
        next
      );
      if (categorie) {
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
      const categorie = await this.categorieService.update(
        req.body,
        files,
        user,
        next
      );
      if (categorie) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
  all_categorie = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;

      const resultPerpage = Number(query.rowsPerPage);
      console.log(query);
      const categorie = await this.categorieService.all_categorie(query);
      const data_counter = await this.categorieService.data_counter(query);
      if (categorie) {
        return res.status(201).json({
          success: true,
          categorie,
          resultPerpage,
          data_counter,
        });
      }
    }
  );
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const categorie = await this.categorieService.find_by_id(id, next);

      if (categorie) {
        return res.status(201).json({
          success: true,
          categorie,
        });
      }
    }
  );
  remove = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const data: any = req.body;
      console.log(data);

      const categorie = await this.categorieService.find_by_id_and_update(
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
export default CategorieController;
