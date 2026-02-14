import { TxtPageTitle } from '@/components/text/Header'
import { TxtParagraph } from '@/components/text/Paragraph'
import {
  AddPassageSection,
  FeeCheckerSection,
  HowItWorksSection,
  PassagesListSection,
} from './components'

export const TollPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <TxtPageTitle>Toll fee calculator</TxtPageTitle>
      <TxtParagraph className="text-gray-400 mb-8">
        Check fees, view passages, and add entries. Mock backend for demo.
      </TxtParagraph>

      <div className="grid gap-6">
        <FeeCheckerSection />
        <AddPassageSection />
        <PassagesListSection />
        <HowItWorksSection />
      </div>
    </div>
  )
}
