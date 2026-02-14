import { TxtParagraph } from '@/components/text/Paragraph'
import {
  AddPassageSection,
  HowItWorksSection
} from './components'

export const TollPage = () => {
  return (
    <div>
      <TxtParagraph className="text-text-secondary mb-8">
        Check fees, view passages, and add entries. Mock backend for demo.
      </TxtParagraph>

      <div className="grid gap-6">
        <AddPassageSection />
        <HowItWorksSection />
      </div>
    </div>
  )
}
