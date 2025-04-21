"use client";

import { useRouteChange } from "@/hooks/useRouteChange";
import LoadingOverlay from "./LoadingOverlay";

export default function ClientLayout({ children }) {
    const { isLoading, finishLoading } = useRouteChange();

    return (
        <>
            <LoadingOverlay isActive={isLoading} onFinish={finishLoading} />
            {children}
        </>
    );
}
