import { Button, TextAreaField } from "./Helpers";


const PostForm = ({ type, post, setPost, submitting, handleSubmit, handleCancel }:any) => {
  return (
    <div className="mx-auto py-6 sm:px-6 lg:px-8">
      <section className="w-full max-w-full flex flex-col place-items-center">
        <h1 className="mb-5">
          <span className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-primary-hover to-secondary">
            {type} Post
          </span>
        </h1>

        <form
          className="flex flex-col w-full max-w-2xl gap-4 items-center"
          onSubmit={handleSubmit}
        >

          <TextAreaField
            value={post.title}
            onChange={(e:any) => setPost({ ...post, title: e.target.value })}
            required
            placeholder="Write your title here..."
            id="postTitle"
            classNameCont='w-full text-main-text'
            className="rounded-lg py-2 bg-card-bg backdrop-blur-md w-full h-10 px-4 shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            label='Your Post Title'
          />

          <TextAreaField
            value={post.description}
            onChange={(e:any) => setPost({ ...post, description: e.target.value })}
            required
            placeholder="Write your description here..."
            id="postDesc"
            classNameCont='w-full text-main-text'
            className="rounded-lg py-2 bg-card-bg backdrop-blur-md w-full h-10 px-4 shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            label='Your Post Description'
          />

          <div className="flex justify-center mx-3 mb-5 gap-4 mt-3">
            <Button type='button' className='bg-red-500 hover:bg-red-600 text-background py-2 px-4 rounded-full flex-row gap-2' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-background py-2 px-4 rounded-full flex-row gap-2"
              disabled={submitting}>
              {submitting ? `${type}...` : `${type}`}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PostForm;