
import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { horizontal?: boolean; clickable?: boolean }
>(({ className, horizontal, clickable, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      horizontal && "flex overflow-hidden",
      clickable && "cursor-pointer hover:shadow-md transition-shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
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
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; square?: boolean; mobileView?: boolean }
>(({ className, src, alt, square, mobileView, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "relative", 
      mobileView ? "w-24 h-24 rounded-md overflow-hidden" : "", 
      className
    )} 
    {...props}
  >
    {src ? (
      <div className={mobileView ? "h-full w-full" : square ? "aspect-square" : ""}>
        {square && !mobileView ? (
          <AspectRatio ratio={1/1}>
            <img src={src} alt={alt || ""} className="h-full w-full object-cover" />
          </AspectRatio>
        ) : (
          <img src={src} alt={alt || ""} className="h-full w-full object-cover" />
        )}
      </div>
    ) : (
      <div className={cn(
        "h-full w-full bg-gray-100 flex items-center justify-center",
        square && !mobileView ? "aspect-square" : "",
        mobileView ? "rounded-md" : ""
      )}>
        <span className="text-gray-400 text-xs">Nessuna immagine</span>
      </div>
    )}
  </div>
))
CardImage.displayName = "CardImage"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
