import { TxtParagraph } from '@/components/text/Paragraph'
import {
  AddPassageSection,
  HowItWorksSection,
  PassagesListSection,
} from './components'

export const TollPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <TxtParagraph className="text-gray-400 mb-8">
        Check fees, view passages, and add entries. Mock backend for demo.
      </TxtParagraph>

      <div className="grid gap-6">
        <AddPassageSection />
        <PassagesListSection />
        <HowItWorksSection />
      </div>
    </div>
  )
}
