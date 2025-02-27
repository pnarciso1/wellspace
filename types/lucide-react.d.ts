declare module 'lucide-react/dist/esm' {
  import { FC, SVGProps } from 'react'

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }

  export const Activity: FC<IconProps>
  export const UserCheck: FC<IconProps>
  export const FileCheck: FC<IconProps>
  export const Heart: FC<IconProps>
  export const FileText: FC<IconProps>
  export const Video: FC<IconProps>
  export const Calendar: FC<IconProps>
  export const MessageSquare: FC<IconProps>
  export const Users: FC<IconProps>
  export const Check: FC<IconProps>
  export const Trophy: FC<IconProps>
  export const Star: FC<IconProps>
  export const Settings: FC<IconProps>
  export const LogOut: FC<IconProps>
  export const Menu: FC<IconProps>
  export const X: FC<IconProps>
  export const ChevronRight: FC<IconProps>
  export const ChevronLeft: FC<IconProps>
  export const ChevronDown: FC<IconProps>
  export const ChevronUp: FC<IconProps>
  export const Plus: FC<IconProps>
  export const Minus: FC<IconProps>
  export const Search: FC<IconProps>
  export const Bell: FC<IconProps>
  export const Home: FC<IconProps>
  export const User: FC<IconProps>
  export const Mail: FC<IconProps>
  export const Phone: FC<IconProps>
  export const Lock: FC<IconProps>
  export const Unlock: FC<IconProps>
  export const Edit: FC<IconProps>
  export const Trash: FC<IconProps>
  export const Save: FC<IconProps>
  export const Download: FC<IconProps>
  export const Upload: FC<IconProps>
  export const RefreshCw: FC<IconProps>
  export const AlertCircle: FC<IconProps>
  export const CheckCircle: FC<IconProps>
  export const XCircle: FC<IconProps>
  export const InfoIcon: FC<IconProps>
}

declare module 'lucide-react/dist/cjs' {
  export * from 'lucide-react/dist/esm'
}

declare module 'lucide-react' {
  export * from 'lucide-react/dist/esm'
}
