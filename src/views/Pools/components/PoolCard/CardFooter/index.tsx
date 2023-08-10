import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import useTheme from 'hooks/useTheme'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
  txtColor?: string
  txtColorMain?: string
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const StyledCardFooter = styled(CardFooter) <{ $bgColor?: string }>`
  background: ${(props) => (props.$bgColor || '#fff')};
  border-radius: 10px;
  padding: 24px;
  border: none;
`

const StyledTagWrapper = styled.div <{ $color?: string, $bgColor?: string }>`
  > div {
    padding: 8px 12px;
    background: ${(props) => (props.$bgColor ? props.$bgColor : '#fff')};
    border: 1px solid #60C5BA;
    box-sizing: border-box;
    border-radius: 30px;
    border: ${(props) => (props.$bgColor ? `1px solid ${props.$bgColor}` : '1px solid #fff')};
    color: #fff;

    > svg {
      margin-right: 8px;
      fill: #fff;
    }
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, defaultExpanded, txtColor, txtColorMain }) => {
  const { theme } = useTheme()

  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <StyledCardFooter
      $bgColor={theme.isDark ? theme.colors.bgDark : theme.colors.bgBright}
    >
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {vaultKey ? (
            <StyledTagWrapper $color={txtColor} $bgColor={txtColorMain}>
              <CompoundingPoolTag />
            </StyledTagWrapper>
          ) : (
            <StyledTagWrapper $color={txtColor} $bgColor='#60C5BA'>
              <ManualPoolTag />
            </StyledTagWrapper>
          )}
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="8px" width="20px" height="20px" color='#60C5BA' />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} labelColor={theme.isDark ? '#fff' : '#000'} valueColor={'#60C5BA'} />}
    </StyledCardFooter>
  )
}

export default Footer
