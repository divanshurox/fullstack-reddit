import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching }, logout] = useLogoutMutation();
  let body = null;
  if (!data?.me?.user) {
    body = (
      <Box ml="auto">
        <NextLink href="/login">
          <Link mr={9}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={5}>Register</Link>
        </NextLink>
      </Box>
    );
  } else {
    body = (
      <Flex ml="auto">
        <Box mr={3}>Welcome {data.me.user?.username}</Box>
        <NextLink href="/create-post">
          <Link mr={2}>Create Post</Link>
        </NextLink>
        <Button
          onClick={() => {
            logout();
          }}
          variant="link"
          color="black"
          isLoading={fetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" zIndex={2} position="sticky" top={0} p={4}>
      {body}
    </Flex>
  );
};
