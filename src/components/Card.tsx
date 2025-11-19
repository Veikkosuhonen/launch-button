import React from "react"
import { cn } from "@/lib/utils"

const Card = ({ className1, className2, children }: {
  className1?: string
  className2?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      "text-card-foreground shadow-sm bg-gradient-to-br from-card-accent to-card rounded-lg p-[2px] card-border",
      className1
    )}
  >
    <div className={cn(
      "relative z-10 w-full h-full p-2 bg-card rounded-lg card-border",
      className2
    )}
    >
      {children}
    </div>
  </div>
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }

export const CardSkeleton = () => (
  <Card
    className1="hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-32"
>
    <div className="flex items-start gap-3">
    <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm mt-0.5 animate-pulse">
        <p>Loading...</p>
        </div>
    </div>
    </div>
</Card>
)