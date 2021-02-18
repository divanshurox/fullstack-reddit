import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Button, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { PostCard } from "../components/PostCard";

const Index = () => {
  const [variables, setvariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, []);
  const [{ data, fetching }] = usePostsQuery({
    variables,
    requestPolicy: "cache-and-network",
  });
  return (
    <Layout>
      <Flex>
        <Heading fontSize="2xl">LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading..</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((ele, i) => (
            <PostCard key={i} item={ele} />
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex my={6}>
          <Button
            onClick={() => {
              setvariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            variant="solid"
            colorScheme="teal"
          >
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index);
