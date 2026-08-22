"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface SubmitButtonProps extends ButtonProps {
  loadingText?: React.ReactNode;
}

export function SubmitButton({ children, loadingText, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      loading={pending} 
      disabled={pending || props.disabled} 
      {...props}
    >
      {pending && loadingText ? loadingText : children}
    </Button>
  );
}
