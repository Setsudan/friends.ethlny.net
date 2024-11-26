import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { AuthFormProps } from '@/types/auth';

export const AuthLayout = ({
    children,
    onSubmit,
    title,
    error,
    titleColor,
    bgColor,
    rotation
}: AuthFormProps) => (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
        <div className={`w-full max-w-md bg-white border-4 border-black p-8 transform ${rotation} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
            <h2 className={`text-4xl font-black mb-6 text-center transform skew-x-6 ${titleColor} text-white py-2 px-4 inline-block`}>
                {title}
            </h2>

            {error && (
                <Alert variant="destructive" className="mb-6 border-2 border-black">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{error.message}</AlertTitle>
                    <AlertDescription>{error.details}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
                {children}
            </form>
        </div>
    </div>
);