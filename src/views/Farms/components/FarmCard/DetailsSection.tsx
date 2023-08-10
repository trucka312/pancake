import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from '@pancakeswap/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  svg {
    fill: #60C5BA;
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{t('Total Liquidity')}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      {!removed && (
        <StyledLinkExternal color="textSubtle" href={addLiquidityUrl}>
          {t('Get %symbol%', { symbol: lpLabel })}
        </StyledLinkExternal>
      )}
      <StyledLinkExternal color="textSubtle" href={bscScanAddress}>
        {t('View Contract')}
      </StyledLinkExternal>
      <StyledLinkExternal color="textSubtle" href={infoAddress}>
        {t('See Pair Info')}
      </StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
