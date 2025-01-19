import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import CustomerService from "../../../services/crm/customerService";
import ErrorHandler from "../../../utils/ErrorHandler";

class CustomerController {
  constructor(private customerService: CustomerService) {}
  add_new_customer = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      const customer = await this.customerService.add_new_customer(
        req.body,
        user,
        next
      );
      if (customer) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
  update_details = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      
      const customer = await this.customerService.update_details(req.body,user, next);
      if (customer) {
        return res.status(201).json({
          success: true,
        });
      }
    }
  );
  all_customers = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;

      const resultPerpage = Number(query.rowsPerPage);

      const customer = await this.customerService.all_customers(query);
      const data_counter = await this.customerService.data_counter(query);
      if (customer) {
        return res.status(201).json({
          success: true,
          customer,
          resultPerpage,
          data_counter,
        });
      }
    }
  );
  get_customer = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const customer = await this.customerService.find_by_id(id, next);
 
      if (customer) {
        return res.status(201).json({
          success: true,
          customer
        });
      }
    }
  );
  removeCustomer = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const data: any = req.body;
      console.log(data);

      const customer = await this.customerService.find_by_id_and_update(
        id,
        data,
        next
      );
      if (customer) {
        return res.status(200).json({
          succes: true,
        });
      }
    }
  );
}
export default CustomerController;
