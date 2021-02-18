import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostFragFragment } from "../generated/graphql";
import { UpdootSection } from "./UpdootSection";

// interface Author {
//   id: number;
//   username: string;
//   email: string;
// }

// interface Item {
//   id: number;
//   title: string;
//   textSnippet: string;
//   createdAt: string;
//   points: number;
//   author: Author;
// }

interface PostCardProps {
  item: PostFragFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ item }) => {
  return (
    <Box
      _hover={{
        shadow: "xl",
      }}
      shadow="md"
      borderWidth="1px"
      padding={8}
    >
      <Flex>
        <UpdootSection item={item} />
        <Box>
          <Heading fontSize="xl">{item.title}</Heading>
          <Text>posted by- @{item.author.username}</Text>
          <Text mt={4}>{item.textSnippet}...</Text>
        </Box>
      </Flex>
    </Box>
  );
};
