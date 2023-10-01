import { trpc } from "@/utils/trpc";
import { Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

type GetUserAPIResponseType = {
  username: string;
};

const TestPage: React.FC = () => {
  const [user, setUser] = useState<GetUserAPIResponseType>({ username: "" });
  const [id, setId] = useState<string>("");

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const idNum = parseInt(id);
      const user = await trpc.findById.query(idNum);
      setUser({ username: user?.username || "" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Input
          value={id}
          width="98px"
          placeholder="User ID"
          onChange={handleIdChange}
        />
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
