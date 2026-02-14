import type { ComponentPropsWithoutRef } from 'react'

export type InputWithTextProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  className?: string
}
