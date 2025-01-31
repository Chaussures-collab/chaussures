import { useState } from 'react'

export default function useToggle() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
  return {
    isLoading,
    setIsLoading
  }
}
