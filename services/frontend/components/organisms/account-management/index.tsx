import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

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
        <ModalHeader>Header here</ModalHeader>
        <ModalBody>Body here. Operation: {operation}</ModalBody>
        <ModalFooter>Footer here</ModalFooter>
      </ModalContent>
    </Modal>
  );
};
