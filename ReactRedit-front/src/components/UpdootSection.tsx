import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { PostFragFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  item: PostFragFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ item }) => {
  const [, vote] = useVoteMutation();
  console.log(item);
  return (
    <Flex
      flexDirection="column"
      mr={5}
      justifyContent="center"
      alignItems="center"
    >
      <IconButton
        onClick={() => {
          if (item.isUpVoted === 1) {
            return;
          }
          vote({ value: 1, postId: item.id });
        }}
        colorScheme={item.isUpVoted === 1 ? "orange" : "blackAlpha"}
        aria-label="Call Sage"
        fontSize="20px"
        icon={<ArrowUpIcon />}
        size="sm"
      />

      <Text>{item.points}</Text>
      <IconButton
        onClick={() => {
          if (item.isUpVoted === -1) {
            return;
          }
          vote({ value: -1, postId: item.id });
        }}
        colorScheme={item.isUpVoted === -1 ? "orange" : "blackAlpha"}
        aria-label="Call Sage"
        fontSize="20px"
        icon={<ArrowDownIcon />}
        size="sm"
      />
    </Flex>
  );
};
