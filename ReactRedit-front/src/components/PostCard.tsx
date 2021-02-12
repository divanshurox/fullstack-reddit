import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Post } from "../generated/graphql";

interface Item {
  id: number;
  title: string;
  textSnippet: string;
  createdAt: string;
}

interface PostCardProps {
  item: Item;
}

export const PostCard: React.FC<PostCardProps> = ({ item }) => {
  return (
    <Box shadow="md" borderWidth="1px" padding={8}>
      <Heading fontSize="xl">{item.title}</Heading>
      <Text mt={4}>{item.textSnippet}...</Text>
    </Box>
  );
};
