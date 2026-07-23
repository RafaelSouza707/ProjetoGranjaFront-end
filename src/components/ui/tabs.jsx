import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props} />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // Layout Base & Tipografia
        "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200",
        "text-muted-foreground hover:text-foreground/90",
        "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
        
        // Alinhamento Vertical
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        
        // Estilo Texto Ativo (Escuta múltiplos estados possíveis para não errar)
        "data-[selected]:text-foreground data-[state=active]:text-foreground data-active:text-foreground font-semibold",
        
        // Efeito de Foco (Acessibilidade)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 rounded-sm",
        
        // Ícones internos
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 [&_svg]:opacity-70 [&_svg]:transition-opacity",
        "data-[selected]:[&_svg]:opacity-100 data-[state=active]:[&_svg]:opacity-100 data-active:[&_svg]:opacity-100",
        
        // A Linha Indicadora Animada no Rodapé
        "after:absolute after:bottom-1 after:h-[2px] after:w-full after:bg-primary after:transform after:scale-x-0 after:transition-transform after:duration-200",
        "data-[selected]:after:scale-x-100 data-[state=active]:after:scale-x-100 data-active:after:scale-x-100",
        
        // Suporte para Abas Verticais
        "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:right-0 group-data-vertical/tabs:after:w-[2px] group-data-vertical/tabs:after:h-full group-data-vertical/tabs:after:scale-x-100 group-data-vertical/tabs:after:scale-y-0",
        "data-[selected]:group-data-vertical/tabs:after:scale-y-100 data-[state=active]:group-data-vertical/tabs:after:scale-y-100 data-active:group-data-vertical/tabs:after:scale-y-100",
        
        className
      )}
      {...props} />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
