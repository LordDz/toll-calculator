import { TxtParagraph } from '@/components/text/Paragraph'
import type { QueryWrapperProps } from './QueryWrapper.types'

export function QueryWrapper<TData>({
  query,
  loadingMessage = 'Loading…',
  noDataMessage = 'No data.',
  errorMessage = (error) => `Error: ${error?.message ?? 'Unknown error'}`,
  children,
}: Readonly<QueryWrapperProps<TData>>) {
  if (query.isLoading) {
    return (
      <TxtParagraph className="text-gray-400">
        {loadingMessage}
      </TxtParagraph>
    )
  }

  if (query.isError && query.error) {
    return (
      <TxtParagraph className="text-red-400">
        {errorMessage(query.error)}
      </TxtParagraph>
    )
  }

  if (query.data === undefined) {
    return (
      <TxtParagraph className="text-gray-500">
        {noDataMessage}
      </TxtParagraph>
    )
  }

  if (Array.isArray(query.data) && query.data.length === 0) {
    return (
      <TxtParagraph className="text-gray-500">
        {noDataMessage}
      </TxtParagraph>
    )
  }

  return children(query.data)
}
