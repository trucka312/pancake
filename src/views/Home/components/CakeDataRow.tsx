import { Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import cakeAbi from 'config/abi/cake.json'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useEffect, useState } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import styled, { css } from 'styled-components'
import { formatBigNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import useTheme from 'hooks/useTheme'

const styleForBasicColumn = `
  background: linear-gradient(115.97deg, rgba(96, 197, 186, 0) 1.04%, rgba(96, 197, 186, 0.54) 100%);
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  // border: 1px solid;
  // border-image-source: linear-gradient(180deg, #60c5ba 0%, rgba(96, 197, 186, 0) 100%);
  // border-image-slice: 1;
  border-radius: 10px;
  position: relative;

  ::before {
    content: "";
    position: absolute;
    border-radius: 10px;
    // Change to "padding: 10px" to know why?
    // padding: 10px;
    padding: 1px;
    inset: 0;
    background: linear-gradient(180deg, #60c5ba 0%, rgba(96, 197, 186, 0) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
  }
  
  @media screen and (max-width: 576px) {
    backdrop-filter: blur(5px);
  }
`

const styleForColumnValue = `
  font-weight: 700;
  font-size: 32px;
  line-height: 33px;
  color: #0B3854;
  text-align: center;
  margin-bottom: 11px;
  width: 185px;
`

const StyledColumnTitle = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  line-height: 21px;
  color: #60c5ba;
  text-align: center;
  margin-bottom: 6px;
`

const StyledColumBalanceValue = styled(Balance) <{ $isDarkStyle?: boolean }>`
  ${styleForColumnValue}

  ${(props) => props.$isDarkStyle && css`
    color: #fff;
  `}
`

const StyledColumHeadingValue = styled(Heading) <{ $isDarkStyle?: boolean }>`
  ${styleForColumnValue}

  ${(props) => props.$isDarkStyle && css`
    color: #fff;
  `}
`

const StyledColumn = styled(Flex) <{ noMobileBorder?: boolean }>`
  ${styleForBasicColumn}

  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 16px 16px;
         }
       `
      : `padding: 16px 8px;
         ${theme.mediaQueries.sm} {
           padding: 16px 16px;
         }
       `}
`

const Grid = styled.div`
  // display: grid;
  // margin-top: 40px;
  // grid-gap: 16px 16px;
  // grid-template-columns: repeat(2, auto);

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   grid-gap: 16px;
  // }

  // ${({ theme }) => theme.mediaQueries.md} {
  //   grid-gap: 40px;
  //   grid-template-columns: repeat(4, auto);
  // }

  display: grid;
  margin-top: 40px;
  grid-gap: 40px;
  grid-template-columns: repeat(4, auto);

  @media screen and (max-width: 992px) {
    grid-gap: 24px;
    grid-template-columns: repeat(2, auto);
  }

  @media screen and (max-width: 576px) {
    grid-gap: 16px;
    grid-template-columns: repeat(1, auto);
  }
`

const emissionsPerBlock = 14.25

const CakeDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const {
    data: { cakeSupply, burnedBalance } = {
      cakeSupply: 0,
      burnedBalance: 0,
    },
  } = useSWR(
    loadData ? ['cakeDataRow'] : null,
    async () => {
      const totalSupplyCall = { address: tokens.cake.address, name: 'totalSupply' }
      const burnedTokenCall = {
        address: tokens.cake.address,
        name: 'balanceOf',
        params: ['0x000000000000000000000000000000000000dEaD'],
      }
      const tokenDataResultRaw = await multicallv2(cakeAbi, [totalSupplyCall, burnedTokenCall], {
        requireSuccess: false,
      })
      const [totalSupply, burned] = tokenDataResultRaw.flat()

      return {
        cakeSupply: totalSupply && burned ? +formatBigNumber(totalSupply.sub(burned)) : 0,
        burnedBalance: burned ? +formatBigNumber(burned) : 0,
      }
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
  const cakePriceBusd = usePriceCakeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())

  const { theme } = useTheme()

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <Grid>
      <StyledColumn flexDirection="column">
        <StyledColumnTitle color="textSubtle">{t('Total supply')}</StyledColumnTitle>
        {cakeSupply ? (
          <StyledColumBalanceValue $isDarkStyle={theme.isDark} decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={185} my="4px" />
          </>
        )}
      </StyledColumn>
      <StyledColumn>
        <StyledColumnTitle color="textSubtle">{t('Burned to date')}</StyledColumnTitle>
        {burnedBalance ? (
          <StyledColumBalanceValue $isDarkStyle={theme.isDark} decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={185} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <StyledColumnTitle color="textSubtle">{t('Market cap')}</StyledColumnTitle>
        {mcap?.gt(0) && mcapString ? (
          <StyledColumHeadingValue $isDarkStyle={theme.isDark} scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</StyledColumHeadingValue>
        ) : (
          <Skeleton height={24} width={185} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <StyledColumnTitle color="textSubtle">{t('Current emissions')}</StyledColumnTitle>

        <StyledColumHeadingValue $isDarkStyle={theme.isDark} scale="lg">
          {t('%cakeEmissions%/block', { cakeEmissions: emissionsPerBlock })}
        </StyledColumHeadingValue>
      </StyledColumn>
    </Grid>
  )
}

export default CakeDataRow
