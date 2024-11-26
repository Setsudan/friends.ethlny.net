import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField as FormFieldType } from '@/types/auth';

export const FormField = ({
    id,
    label,
    type,
    value,
    onChange,
    required,
    minLength,
    name
}: FormFieldType) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-lg font-bold">
            {label}
        </Label>
        <Input
            id={id}
            type={type}
            name={name || id}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
            className="border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);