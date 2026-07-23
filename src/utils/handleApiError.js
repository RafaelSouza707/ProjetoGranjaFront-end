import { toast } from "sonner"

export function handleApiError(error) {
    toast.error(error.message)
}