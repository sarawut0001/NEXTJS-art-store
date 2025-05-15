import Modal from "@/components/shared/Modal";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Form from "next/form";
import { cancelOrderStatusAction } from "../actions/order";
import { useForm } from "@/hooks/useForm";

interface CancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const CancelModal = ({ open, onOpenChange, orderId }: CancelModalProps) => {
  const { formAction, isPending } = useForm(cancelOrderStatusAction);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel Order"
      description="Are you sure to cancel order."
    >
      <Form action={formAction}>
        <input type="hidden" name="order-id" value={orderId} />

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <SubmitBtn
            name="Cancel order"
            icon={Ban}
            className="bg-destructive hover:bg-destructive/80"
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  );
};
export default CancelModal;
