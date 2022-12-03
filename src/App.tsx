import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Button,
  Card,
  Elevation,
  Spinner,
  Callout,
  Dialog,
} from "@blueprintjs/core";

import { usePosts } from "./hooks/usePosts";
import { usePost } from "./hooks/usePost";
import { useCreatePost } from "./hooks/useCreatePost";
import { IPost } from "./services/post.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Post({
  postId,
  onBackClick,
}: {
  postId: string;
  onBackClick: () => void;
}) {
  const { isLoading, post, refetch } = usePost(postId);

  if (isLoading) return <Spinner />;

  if (!post) return <Callout>No Data To Display</Callout>;

  return (
    <Card interactive={true} elevation={Elevation.TWO}>
      <p>{post.author}</p>
      <p>{post.title}</p>
      <p>{post.description}</p>
      <Button onClick={() => refetch()}>Update</Button>
      <Button onClick={onBackClick}>Back</Button>
    </Card>
  );
}

function Posts() {
  const [postId, setPostId] = useState<string | null>(null);
  const { isLoading, posts } = usePosts();

  const onPostClick = (id: string) => setPostId(id);

  const onBackClick = (): void => setPostId(null);

  if (isLoading) return <Spinner />;

  if (postId) {
    return <Post postId={postId} onBackClick={onBackClick} />;
  }

  if (posts?.length) {
    return (
      <>
        {posts.map(({ title, author, id, description }) => {
          return (
            <Card key={id} interactive={true} elevation={Elevation.TWO}>
              <p>{title}</p>
              <Button onClick={() => onPostClick(id)}>Read</Button>
            </Card>
          );
        })}
        <br />
        <br />
      </>
    );
  }

  return <Callout>No Data To Display</Callout>;
}

const CreatePost = () => {
  const { refetch } = usePosts(false);
  const [values, setValues] = useState<IPost>({} as IPost);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync, isSuccess, isLoading } = useCreatePost();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await mutateAsync(values);
  };

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      refetch();
    }
  }, [isSuccess]);

  return (
    <>
      <Dialog title="Add Post" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form className="bp4-input-group" onSubmit={handleSubmit}>
          <div className="bp4-dialog-body">
            <input
              className="bp4-input"
              type="text"
              name="author"
              value={values.author}
              onChange={handleChange}
              placeholder="Author"
            />
          </div>
          <div className="bp4-dialog-body">
            <input
              className="bp4-input"
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Title"
            />
          </div>
          <div className="bp4-dialog-body">
            <textarea
              className="bp4-input"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>
          <div className="bp4-dialog-footer">
            <div className="bp4-dialog-footer-actions">
              <button
                type="button"
                className="bp4-button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bp4-button bp4-intent-primary"
              >
                Add Post
              </button>
            </div>
          </div>
        </form>
      </Dialog>
      <button
        className="bp4-button bp4-fill float-button"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Add Post
      </button>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
      <CreatePost />
    </QueryClientProvider>
  );
}

export default App;
