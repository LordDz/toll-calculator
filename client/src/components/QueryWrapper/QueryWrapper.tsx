import { TxtParagraph } from '@/components/text/Paragraph'
import type { QueryWrapperProps } from './QueryWrapper.types'

const defaultMessageClass = 'text-gray-400'
const defaultErrorClass = 'text-red-400'

export function QueryWrapper<TData>({
  query,
  loadingMessage = 'Loading…',
  noDataMessage = 'No data.',
  errorMessage = (error) => `Error: ${error?.message ?? 'Unknown error'}`,
  messageClassName = defaultMessageClass,
  children,
}: Readonly<QueryWrapperProps<TData>>) {
  if (query.isLoading) {
    return (
      <TxtParagraph className={messageClassName}>
        {loadingMessage}
      </TxtParagraph>
    )
  }

  if (query.isError && query.error) {
    const errorClass = messageClassName === defaultMessageClass ? defaultErrorClass : 'text-red-600'
    return (
      <TxtParagraph className={errorClass}>
        {errorMessage(query.error)}
      </TxtParagraph>
    )
  }

  if (query.data === undefined) {
    return (
      <TxtParagraph className={messageClassName}>
        {noDataMessage}
      </TxtParagraph>
    )
  }

  if (Array.isArray(query.data) && query.data.length === 0) {
    return (
      <TxtParagraph className={messageClassName}>
        {noDataMessage}
      </TxtParagraph>
    )
  }

  return children(query.data)
}
