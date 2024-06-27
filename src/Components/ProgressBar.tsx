import { Box, Flex } from "@chakra-ui/react";

function ProgressBar() {
  return (
    <Flex alignItems="center" gap="1" marginTop={5}>
      {Array.from({ length: 5 }).map((_, index) => {
        return <Box key={index} h={2} w={50} backgroundColor="black" />;
      })}
    </Flex>
  );
}

export default ProgressBar;
