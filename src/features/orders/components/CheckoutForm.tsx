"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserType } from "@/types/user";
import Form from "next/form";
import InputForm from "./../../../components/shared/InputForm";
import { Textarea } from "@/components/ui/textarea";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { ShoppingBag } from "lucide-react";
import { checkoutAction } from "../actions/order";
import { useForm } from "@/hooks/useForm";
import ErrorMessage from "@/components/shared/ErrorMessage";

interface CheckoutFormProps {
  user: UserType;
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const hasUserData = !!(user.address && user.tel);

  const { errors, formAction, isPending, clearErrors } =
    useForm(checkoutAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Delivery Information</CardTitle>
      </CardHeader>

      <Form action={formAction} onChange={clearErrors}>
        <CardContent className="flex flex-col gap-4">
          {hasUserData && (
            <div className="flex items-center space-x-2 mb-4 p-3 rounded-md bg-muted/50">
              <Switch
                id="use-profile-data"
                name="use-profile-data"
                defaultChecked
              />
              <Label htmlFor="use-profile-data">Use data from my profile</Label>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <InputForm
              label="Tel"
              id="phone"
              placeholder="08x-xxx-xxxx"
              defaultValue={user.tel || ""}
              required
            />
            {errors.phone && <ErrorMessage error={errors.phone[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>

            <Textarea
              id="address"
              name="address"
              defaultValue={user.address || ""}
              placeholder="Please input your address"
              className="min-h-24"
            />
            {errors.address && <ErrorMessage error={errors.address[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Note (if any)"
              className="min-h-20"
            />
            {errors.note && <ErrorMessage error={errors.note[0]} />}
          </div>

          <div className="pt-4">
            <SubmitBtn
              name="Place an order"
              icon={ShoppingBag}
              className="w-full"
              pending={isPending}
            />
          </div>
        </CardContent>
      </Form>
    </Card>
  );
};
export default CheckoutForm;
