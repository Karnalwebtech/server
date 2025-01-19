import contactUsRoutes from "../api/karnalwebtech/routes/contact-us-route";
import portfolioRoutes from "../api/karnalwebtech/routes/portfolio-route";
import categorieRoutes from "../api/karnalwebtech/routes/post-categorie-route";
import postRoutes from "../api/karnalwebtech/routes/post-route";
import subscribersRoutes from "../api/karnalwebtech/routes/subscribers-route";
import tagRoutes from "../api/karnalwebtech/routes/tag-route";

const karnalwebteh_routesLoader = (app: any, controllers: any) => {
  app.use(
    "/api/v2/categorie",
    categorieRoutes(controllers.categorieController)
  );
  app.use("/api/v2/tag", tagRoutes(controllers.tagController));
  app.use("/api/v2/post", postRoutes(controllers.postController));
  app.use(
    "/api/v2/portfolio",
    portfolioRoutes(controllers.portfolioController)
  );
  app.use(
    "/api/v2/contact-us",
    contactUsRoutes(controllers.contactUsController)
  );
  app.use(
    "/api/v2/subscriber",
    subscribersRoutes(controllers.subscribersController)
  );
};

export default karnalwebteh_routesLoader;
