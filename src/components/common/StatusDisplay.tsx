// components/StatusDisplay.tsx
import { InfoIcon } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type StatusDisplayProps = {
    status: 'checking' | 'up' | 'down';
};

const StatusMessages = {
    checking: <span className="text-gray-500">Je regarde ça...</span>,
    up: <span className="text-green-500">On est tout bon</span>,
    down: (
        <Drawer>
            <DrawerTrigger className="cursor-pointer w-full flex flex-row">
                <span className="text-red-500">Ah y a un problème... Que faire ?</span>
                <InfoIcon className="text-red-500 mx-2 w-6 h-6" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Mon ordi est éteint</DrawerTitle>
                    <DrawerClose />
                </DrawerHeader>
                <DrawerDescription>
                    <div className="px-4 py-2">
                        <p>Le premier défi pour ce site c&apos;était le stockage de fichier en quantité importante.</p>
                        <p>Pour régler ce problème on se sert de mon pc pour stocker les fichiers.</p>
                        <p>Appel moi ou envoie moi un message si je peux te le mettre en ligne je le fait</p>
                    </div>
                </DrawerDescription>
            </DrawerContent>
        </Drawer>
    ),
};

export const StatusDisplay = ({ status }: StatusDisplayProps) => (
    <div className="flex items-center md:gap-2 gap-1">
        <span>Status: </span>
        {StatusMessages[status]}
    </div>
);