import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

import React from "react";

const Spinner = React.forwardRef<SVGSVGElement, React.ComponentProps<"svg">>(
  ({ className, ...props }, ref) => {
    // Remove 'ref' from props to avoid passing string refs
    const { ref: _ref, ...restProps } = props;
    return (
      <Loader2Icon
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...restProps}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner }
