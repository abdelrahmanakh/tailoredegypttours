import { cn } from "@/lib/utils"

const Button = ({ className, variant = "primary", size = "default", ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg",
    outline: "border border-primary text-primary hover:bg-emerald-50",
    ghost: "text-primary hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition duration-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Button }