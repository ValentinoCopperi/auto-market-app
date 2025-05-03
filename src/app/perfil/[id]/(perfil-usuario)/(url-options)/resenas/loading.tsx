import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
const ResenasLoading = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48 rounded-md bg-muted/50" />
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Skeleton key={star} className="h-5 w-5 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                    <Skeleton className="h-5 w-12 rounded-md bg-muted/50" />
                    <Skeleton className="h-4 w-20 rounded-md bg-muted/50" />
                </div>
            </div>

            {/* Review Cards */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full bg-muted/50" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-32 rounded-md bg-muted/50" />
                                <Skeleton className="h-4 w-24 rounded-md bg-muted/50" />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Skeleton key={star} className="h-4 w-4 rounded-sm bg-muted/50" />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 mb-3">
                        <Skeleton className="h-4 w-full rounded-md bg-muted/50" />
                        <Skeleton className="h-4 w-3/4 rounded-md bg-muted/50" />
                        <Skeleton className="h-4 w-1/2 rounded-md bg-muted/50" />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
                        <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ResenasLoading