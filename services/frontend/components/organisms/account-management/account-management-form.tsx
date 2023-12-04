import { Flex, Input } from "@chakra-ui/react";
import { AccountManagementModalType } from ".";

export type AccountManagementFormProps = {
  operation: AccountManagementModalType;
};

export const AccountManagementForm: React.FC<AccountManagementFormProps> = ({
  operation,
}) => {
  return (
    <Flex flexDir={{ md: "column" }}>
      <Input placeholder="Account name" />
      <Input placeholder="Currency" isDisabled={operation === "edit"} />
      <Input placeholder="dd/mm" />
    </Flex>
  );
};
