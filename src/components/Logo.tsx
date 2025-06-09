import { GraduationCap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`inline-flex items-center justify-center bg-primary rounded-full ${sizeClasses[size]} ${className}`}>
      <GraduationCap className={`text-primary-foreground ${size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8"}`} />
    </div>
  );
} 