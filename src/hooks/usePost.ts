import { useQuery } from "react-query";
import { PostService, IPost } from "../services/post.service";

export const usePost = (id?: string) => {
  const {
    isLoading,
    data: post,
    refetch,
  } = useQuery(["posts", id], () => PostService.getById(String(id)), {
    onError: (error: { message: string }) => {
      alert(error.message);
    },
    select: ({ data: post }): IPost => {
      return {
        ...post,
        description: `${post.id} ${post.author} ${post.title}`,
      };
    },
    enabled: !!id,
  });

  return {
    isLoading,
    post,
    refetch,
  };
};
