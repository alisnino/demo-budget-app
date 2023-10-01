import { Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

type GetUserAPIResponseType = {
  username: string;
};

const TestPage: React.FC = () => {
  const [user, setUser] = useState<GetUserAPIResponseType>({ username: "" });

  const handleButtonClick = async () => {
    console.log("button clicked");
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUser({ username: "Beautiful" });
  };

  return (
    <>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Input width="98px" placeholder="User ID" />
        <Button colorScheme="blue" onClick={handleButtonClick}>
          This gets some user data
        </Button>
        {user.username !== "" && (
          <>
            <p>Hey there {user.username}!</p>
          </>
        )}
      </Flex>
    </>
  );
};

export default TestPage;
