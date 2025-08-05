import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PaginationProps {
    data: PaginationData;
    className?: string;
}

export function Pagination({ data, className }: PaginationProps) {
    const { from, to, total, links } = data;

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>

            <div className="flex items-center space-x-2">
                {/* Previous button */}
                {links[0]?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={links[0].url}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                )}

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {links.slice(1, -1).map((link, index) => {
                        if (link.label === '...') {
                            return (
                                <div key={index} className="px-3 py-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </div>
                            );
                        }

                        return link.url ? (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                asChild
                            >
                                <Link href={link.url}>{link.label}</Link>
                            </Button>
                        ) : (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>

                {/* Next button */}
                {links[links.length - 1]?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={links[links.length - 1].url!}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
