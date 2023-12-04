import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
} from "@chakra-ui/react";
import { AccountManagementModalType } from ".";
import { z } from "zod";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { DefaultButton } from "@/components/atoms/default-button";

export const AccountManagementFormValidator = z.object({
  accountName: z.string().min(1).max(50),
  currency: z
    .string()
    .min(3, "Invalid currency")
    .max(3, "Invalid currency")
    .regex(/^[A-Z]{3}$/, "Invalid currency"),
  paymentDate: z.string().regex(/^[0-9]{2}\/[0-9]{2}$/, "Invalid date"),
});

export type AccountManagementFormValues = z.infer<
  typeof AccountManagementFormValidator
>;

export type AccountManagementFormProps = {
  operation: AccountManagementModalType;
  formHooks: {
    register: UseFormRegister<AccountManagementFormValues>;
    errors: FieldErrors<AccountManagementFormValues>;
    handleSubmit: UseFormHandleSubmit<AccountManagementFormValues>;
  };
  onCancel: () => void;
  onSave: () => void;
};

export const AccountManagementForm: React.FC<AccountManagementFormProps> = ({
  operation,
  formHooks: { register, errors, handleSubmit },
  onCancel,
  onSave,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit(onSave)}>
        <ModalHeader>
          {operation === "create" ? "Add account" : "Edit account"}
        </ModalHeader>
        <ModalBody>
          <Flex flexDir={{ md: "column" }}>
            <FormControl isInvalid={errors.accountName ? true : false}>
              <FormLabel>Account name</FormLabel>
              <Input
                placeholder="e.g. cash or bank/credit card name"
                {...register("accountName")}
              />
              <FormErrorMessage>{errors.accountName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.currency ? true : false} mt={"8px"}>
              <FormLabel>Currency</FormLabel>
              <Select
                placeholder="e.g. USD, JPY"
                {...register("currency")}
                isDisabled={operation === "edit"}
              >
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
              </Select>
              <FormErrorMessage>{errors.currency?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.paymentDate ? true : false}
              mt={"8px"}
            >
              <FormLabel>Payment date</FormLabel>
              <Input placeholder="dd/mm format" {...register("paymentDate")} />
              <FormErrorMessage>{errors.paymentDate?.message}</FormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex flexDir={{ md: "row" }}>
            <Box mr="8px">
              <DefaultButton
                variant="negative"
                text="Cancel"
                onClick={onCancel}
              />
            </Box>
            <DefaultButton text="Save" isSubmitButton={true} />
          </Flex>
        </ModalFooter>
      </form>
    </>
  );
};
