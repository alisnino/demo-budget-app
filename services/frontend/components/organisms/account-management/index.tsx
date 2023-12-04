import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import {
  AccountManagementForm,
  AccountManagementFormValidator,
  AccountManagementFormValues,
} from "./account-management-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    getValues,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AccountManagementFormValues>({
    resolver: zodResolver(AccountManagementFormValidator),
  });

  const handleSave = () => {
    const data = getValues();
    alert(`data: ${JSON.stringify(data)}`);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <AccountManagementForm
          operation={operation}
          formHooks={{ register, errors, handleSubmit }}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </ModalContent>
    </Modal>
  );
};
