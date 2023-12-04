import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { AccountManagementForm } from "./account-management-form";
import { DefaultButton } from "@/components/atoms/default-button";

export type AccountManagementModalType = "create" | "edit";

export type AccountManagementModalProps = {
  operation: AccountManagementModalType;
  isOpen: boolean;
  onClose: () => void;
};

export const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  operation,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {operation === "create" ? "Add account" : "Edit account"}
        </ModalHeader>
        <ModalBody>
          <AccountManagementForm operation={operation} />
        </ModalBody>
        <ModalFooter>
          <Flex flexDir={{ md: "row" }}>
            <Box mr="4px">
              <DefaultButton
                variant="negative"
                text="Cancel"
                onClick={onClose}
              />
            </Box>
            <DefaultButton text="Save" onClick={onClose} />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
