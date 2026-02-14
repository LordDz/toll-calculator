import { apiToll } from '@/api/queries/toll'
import { QueryWrapper } from '@/components/QueryWrapper'
import { TxtSectionTitle } from '@/components/text/MenuHeader'
import { useQuery } from '@tanstack/react-query'
import { PassagesTable } from './PassagesTable'

export const PassagesListSection = () => {
  const passagesQuery = useQuery(apiToll.getPassages.get())


  return (
    <div className="bg-toll-section rounded-xl p-6">
      <TxtSectionTitle>Toll passages</TxtSectionTitle>
      <QueryWrapper
        query={passagesQuery}
        loadingMessage="Loading…"
        noDataMessage="No data."
        errorMessage={(err) => `Error: ${err.message}`}
        messageClassName="text-text-secondary"
      >
        {(data) => <PassagesTable passages={data} />}
      </QueryWrapper>
    </div>
  )
}
