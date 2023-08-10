import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded = false }) => {
  const { t } = useTranslation()

  return (
    <Wrapper aria-label={t('Hide or show expandable content')} role="button" onClick={() => onClick()}>
      <Text color="#60C5BA" bold>
        {expanded ? t('Hide') : t('Details')}
      </Text>
      {expanded ? <ChevronUpIcon style={{ fill: '#60C5BA ' }} /> : <ChevronDownIcon style={{ fill: '#60C5BA' }} />}
    </Wrapper>
  )
}

export default ExpandableSectionButton
