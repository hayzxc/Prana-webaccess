import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  width?: number
  height?: number
  className?: string
  alt?: string
  query?: string
}

export function PlaceholderImage({
  width = 400,
  height = 300,
  className,
  alt = "Placeholder image",
  query = "placeholder",
}: PlaceholderImageProps) {
  const src = `/placeholder.svg?height=${height}&width=${width}&query=${query}`

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
    />
  )
}
