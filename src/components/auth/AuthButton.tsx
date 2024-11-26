import { Button } from "@/components/ui/button";
import { AuthButtonProps } from '@/types/auth';

export const AuthButton = ({
    loading,
    children,
    bgColor,
    rotation
}: AuthButtonProps) => (
    <Button
        type="submit"
        disabled={loading}
        className={`w-full text-lg font-bold border-2 border-black rounded-none ${bgColor} text-black hover:brightness-95 focus:ring-2 focus:border-transparent transform ${rotation} transition-transform hover:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {children}
    </Button>
);