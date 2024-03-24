import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  keyframes,
} from "@chakra-ui/react"

export type LoadingIconModalProps = {
  isLoading: boolean
}

export const LoadingIconModal: React.FC<LoadingIconModalProps> = ({
  isLoading,
}) => {
  const spin = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `
  return (
    <Modal isOpen={isLoading} onClose={() => {}} isCentered>
      <ModalOverlay bg="rgba(243, 243, 243, 0.8)" />
      <ModalContent
        p="0"
        w="fit-content"
        h="fit-content"
        bgColor="transparent"
        boxShadow="none"
      >
        <ModalBody p="0" w="fit-content" h="fit-content">
          <Box
            border="10px solid"
            borderColor="primary.100"
            borderRadius="50%"
            borderTop="10px solid"
            borderTopColor="primary.400"
            minW="200px"
            minH="200px"
            animation={`${spin} 1.2s infinite cubic-bezier(.2,.44,.84,.61)`}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
