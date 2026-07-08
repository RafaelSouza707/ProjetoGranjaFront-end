import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  titulo = "Confirmação",
  descricao = "Deseja continuar?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {titulo}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {descricao}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {textoCancelar}
          </AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            {textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}