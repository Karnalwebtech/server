import ContactUsRepository from "../../repositories/karnalwebtech/contact-us-repositories";
import PortfoliotRepository from "../../repositories/karnalwebtech/portfolio-repositories";
import CategorieRepository from "../../repositories/karnalwebtech/post-categorie-repositories";
import PostRepository from "../../repositories/karnalwebtech/post-repositories";
import SubscribersRepository from "../../repositories/karnalwebtech/subscribers-repositories";
import TagRepository from "../../repositories/karnalwebtech/tag-repositories";

const repositoriesLoader = () => {
  const categorieRepository = new CategorieRepository();
  const tagRepository = new TagRepository();
  const postRepository = new PostRepository();
  const portfoliotRepository = new PortfoliotRepository();
  const contactUsRepository = new ContactUsRepository();
  const subscribersRepository = new SubscribersRepository();
  return {
    categorieRepository,
    tagRepository,
    postRepository,
    portfoliotRepository,
    contactUsRepository,
    subscribersRepository,
  };
};
export default repositoriesLoader;
