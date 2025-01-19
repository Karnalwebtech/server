import ContactUsRepository from "../../repositories/karnalwebtech/contact-us-repositories";
import PortfoliotRepository from "../../repositories/karnalwebtech/portfolio-repositories";
import CategorieRepository from "../../repositories/karnalwebtech/post-categorie-repositories";
import PostRepository from "../../repositories/karnalwebtech/post-repositories";
import SubscribersRepository from "../../repositories/karnalwebtech/subscribers-repositories";
import TagRepository from "../../repositories/karnalwebtech/tag-repositories";
import ContactUsService from "../../services/karnalwebtech/contact-us-service";
import PortfoliotService from "../../services/karnalwebtech/portfolio-service";
import CategorieService from "../../services/karnalwebtech/post-caregorie-service";
import PostService from "../../services/karnalwebtech/post-service";
import SubscribersService from "../../services/karnalwebtech/subscribers-service";
import TagService from "../../services/karnalwebtech/tag-service";

const servicesLoader = (repositories: {
  categorieRepository: CategorieRepository;
  tagRepository: TagRepository;
  postRepository: PostRepository;
  portfoliotRepository: PortfoliotRepository;
  contactUsRepository: ContactUsRepository;
  subscribersRepository: SubscribersRepository;
}) => {
  const categorieService = new CategorieService(
    repositories.categorieRepository
  );
  const tagService = new TagService(repositories.tagRepository);
  const postService = new PostService(repositories.postRepository);
  const portfoliotService = new PortfoliotService(
    repositories.portfoliotRepository
  );
  const contactUsService = new ContactUsService(
    repositories.contactUsRepository
  );
  const subscribersService = new SubscribersService(
    repositories.subscribersRepository
  );

  return {
    categorieService,
    tagService,
    postService,
    portfoliotService,
    contactUsService,
    subscribersService,
  };
};

export default servicesLoader;
