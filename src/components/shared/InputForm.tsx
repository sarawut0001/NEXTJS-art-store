import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFormPros extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
}

const InputForm = ({
  label,
  id,
  required = false,
  ...props
}: InputFormPros) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Input id={id} name={id} required={required} {...props} />
    </div>
  );
};
export default InputForm;
