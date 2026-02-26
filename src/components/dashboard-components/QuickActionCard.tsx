import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary'
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'outline',
}: QuickActionCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <Button
          variant={variant}
          className="w-full h-auto flex flex-col items-start gap-2 p-4"
          onClick={onClick}
        >
          <div className="flex items-center gap-2 w-full">
            <Icon className="h-5 w-5" />
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <p className="text-xs text-muted-foreground text-left">{description}</p>
        </Button>
      </CardContent>
    </Card>
  )
}
