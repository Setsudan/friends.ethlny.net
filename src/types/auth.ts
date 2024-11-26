import { IError } from "./error";

// types/auth.ts
export interface AuthFormProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    title: string;
    error: IError | null;
    titleColor: string;
    bgColor: string;
    rotation: string;
}

export interface FormField {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    minLength?: number;
    name?: string;
}

export interface AuthButtonProps {
    loading?: boolean;
    children: React.ReactNode;
    bgColor: string;
    rotation: string;
}