import { useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useAllTokenData } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import useTheme from 'hooks/useTheme'
// import { useTranslation } from 'contexts/Localization'

const CardWrapper = styled(NextLinkFromReactRouter) <{
  $txtColor?: string,
  $bgColor?: string,
  $borderColor?: string
}>`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }

  && > div {
    border-radius: 10px;
    border: 1px solid ${(props) => props.$borderColor};
    background: ${(props) => props.$bgColor};
  }
`

const TopMoverCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 30px;
`

const StyledCard = styled(Card)`
  margin: 0;
  border-radius: 0;
  background: transparent;

  && > div {
    border-radius: 0;
    background: transparent;
  }
`
const StyledDataCardTitle = styled(Text)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  text-transform: capitalize;
  margin-bottom: 4px;
`

const StyledPriceUSD = styled(Text)`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  margin-right: 12px;
`

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 0px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  const { theme } = useTheme()
  return (
    <CardWrapper
      to={`/info/token/${tokenData.address}`}
      $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
      $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
    >
      <TopMoverCard>
        <Flex alignItems="center">
          <Box width="32px" height="32px">
            {/* wrapped in a box because of alignment issues between img and svg */}
            <CurrencyLogo address={tokenData.address} size="32px" />
          </Box>
          <Box ml="16px">
            <StyledDataCardTitle color={theme.colors.itemPrimary}>{tokenData.symbol}</StyledDataCardTitle>
            <Flex alignItems="center">
              <StyledPriceUSD fontSize="14px" mr="6px" lineHeight="16px">
                ${formatAmount(tokenData.priceUSD)}
              </StyledPriceUSD>
              <Percent fontSize="14px" value={tokenData.priceUSDChange} />
            </Flex>
          </Box>
        </Flex>
      </TopMoverCard>
    </CardWrapper>
  )
}

const TopTokenMovers: React.FC = () => {
  const allTokens = useAllTokenData()
  // const { t } = useTranslation()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        // eslint-disable-next-line no-nested-ternary
        return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
      })
      .slice(0, Math.min(20, Object.values(allTokens).length))
  }, [allTokens])

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  if (topPriceIncrease.length === 0 || !topPriceIncrease.some((entry) => entry.data)) {
    return null
  }

  return (
    <>
      <StyledCard my="16px">
        {/* <Text ml="16px" mt="8px">
          {t('Top Movers')}
        </Text> */}
        <ScrollableRow ref={increaseRef}>
          {topPriceIncrease.map((entry) =>
            entry.data ? <DataCard key={`top-card-token-${entry.data?.address}`} tokenData={entry.data} /> : null,
          )}
        </ScrollableRow>
      </StyledCard>
    </>
  )
}

export default TopTokenMovers
