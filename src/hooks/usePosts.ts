import { useQuery } from "react-query";
import { PostService, IPost } from "../services/post.service";

export const usePosts = (enabled?: boolean) => {
  const {
    isLoading,
    data: posts,
    refetch,
  } = useQuery("posts", () => PostService.getAll(), {
    onError: (error: { message: string }) => {
      alert(error.message);
    },
    select: ({ data }): IPost[] => {
      return data.map((post) => ({
        ...post,
        description: `${post.id} ${post.author} ${post.title}`,
      }));
    },
    enabled,
  });

  return {
    isLoading,
    posts,
    refetch,
  };
};
