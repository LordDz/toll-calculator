import { apiToll } from '@/api/queries/toll'
import { QueryWrapper } from '@/components/QueryWrapper'
import { TxtSectionTitle } from '@/components/text/Header'
import { useQuery } from '@tanstack/react-query'
import { PassagesTable } from './PassagesTable'

export const PassagesListSection = () => {
  const passagesQuery = useQuery(apiToll.getPassages.get())

  return (
    <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <TxtSectionTitle>Your toll passages</TxtSectionTitle>
      <QueryWrapper
        query={passagesQuery}
        loadingMessage="Loading…"
        noDataMessage="No data."
        errorMessage={(err) => `Error: ${err.message}`}
      >
        {(data) => <PassagesTable passages={data} />}
      </QueryWrapper>
    </section>
  )
}
