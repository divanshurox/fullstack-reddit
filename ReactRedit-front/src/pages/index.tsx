import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>Hello</div>
      <br />
      {!data ? (
        <div>loading..</div>
      ) : (
        data?.posts.map((ele, i) => <div key={i}>{ele.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index);
