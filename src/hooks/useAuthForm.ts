import { useState } from 'react';
import { IError } from '@/types/error';

export const useAuthForm = <T extends Record<string, string>>(initialState: T) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState<IError | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return {
        formData,
        error,
        loading,
        setError,
        setLoading,
        handleChange
    };
};