import { useMutation } from "react-query";
import { PostService, IPost } from "../services/post.service";

export const useCreatePost = () => {
  const params = useMutation(["create post"], (data: IPost) =>
    PostService.createPost(data)
  );

  return params;
};
