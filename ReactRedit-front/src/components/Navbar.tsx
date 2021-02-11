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
      <Flex bg="tomato" p={4}>
        <Box ml="auto">
          <NextLink href="/login">
            <Link mr={9}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link mr={5}>Register</Link>
          </NextLink>
        </Box>
      </Flex>
    );
  } else {
    body = (
      <Flex bg="tomato" p={4}>
        <Flex ml="auto">
          <Box mr={3}>{data.me.user?.username}</Box>
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
      </Flex>
    );
  }
  return body;
};
