import { Box, Flex, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!data?.me.user && !fetching) {
      router.push("/login?next=" + router.pathname);
    }
  }, [data, fetching]);
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ text: "", title: "" }}
        onSubmit={async (values) => {
          console.log(values);
          const { error } = await createPost({ options: values });
          if (!error) router.push("/");
          else {
            router.push("/login");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box mt={8}>
              <InputField
                isTextArea
                name="text"
                placeholder="Text"
                label="Body"
              />
            </Box>
            <Flex mt={2}>
              <Button
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
                mt={5}
                ml="auto"
                mr="auto"
              >
                Upload
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
