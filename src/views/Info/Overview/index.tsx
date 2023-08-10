import { useState, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Flex, Box, Text, Heading, Card, Skeleton } from '@pancakeswap/uikit'
import { fromUnixTime } from 'date-fns'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { formatAmount } from 'utils/formatInfoNumbers'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import {
  useAllPoolData,
  useAllTokenData,
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactions,
} from 'state/info/hooks'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import useTheme from 'hooks/useTheme'
// import TradingView from '../components/InfoCharts/TradingView'

export const ChartCardsContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

const StyledSection = styled.div`
  margin-bottom: 60px;

  &&:last-child {
    margin-bottom: 0;
  }
`

const StyledHeading = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  margin: 0 0 30px 0;
`

const StyledCardForChart = styled(Card)`
  padding: 0;
  background: none;
  border-radius: 0;

  && > div {
    background: none;
    border-radius: 0;
  }
`

const StyledBoxForChart = styled(Box) <{ $bgColor?: string, $borderColor?: string }>`
  background: ${(props) => props.$bgColor || ''};
  border: ${(props) => `1px solid ${props.$borderColor}` || '1px solid transparent'};
  border-radius: 10px;
`

const StyledChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const StyledChartTitle = styled(Text)`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
`

const StyledChartValue = styled(Text)`
  font-size: 40px;
  line-height: 40px;
  font-weight: bold;
`

const StyledChartDate = styled(Text) <{ $isDarkStyle?: boolean }>`
  font-size: 16px;
  line-height: 19px;
  color: #000;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #6E6E6E;
  `}
`

const Overview: React.FC = () => {
  const { theme } = useTheme()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [liquidityDateHover, setLiquidityDateHover] = useState<string | undefined>()
  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [volumeDateHover, setVolumeDateHover] = useState<string | undefined>()

  const [protocolData] = useProtocolData()
  const [chartData] = useProtocolChartData()
  const [transactions] = useProtocolTransactions()

  const currentDate = new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' })

  // Getting latest liquidity and volumeUSD to display on top of chart when not hovered
  useEffect(() => {
    if (volumeHover == null && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  useEffect(() => {
    if (liquidityHover == null && protocolData) {
      setLiquidityHover(protocolData.liquidityUSD)
    }
  }, [liquidityHover, protocolData])

  const formattedLiquidityData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.liquidityUSD,
        }
      })
    }
    return []
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const somePoolsAreLoading = useMemo(() => {
    return Object.values(allPoolData).some((pool) => !pool.data)
  }, [allPoolData])

  return (
    <Page>
      <StyledSection>
        <StyledHeading color="itemPrimary" scale="lg" mb="16px" id="info-overview-title">
          {t('PancakeSwap Info & Analytics')}
        </StyledHeading>
        <ChartCardsContainer>
          <StyledCardForChart>
            <StyledBoxForChart
              $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
              $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#EBEBEB'}
              p={['16px', '16px', '24px']}
            >
              <StyledChartHeader>
                <div>
                  <StyledChartTitle bold color="itemPrimary">
                    {t('Liquidity')}
                  </StyledChartTitle>
                  <StyledChartDate $isDarkStyle={theme.isDark}>{liquidityDateHover ?? currentDate}</StyledChartDate>
                </div>
                <div>
                  {liquidityHover > 0 ? (
                    <StyledChartValue bold color="itemPrimary" fontSize="24px">
                      ${formatAmount(liquidityHover)}
                    </StyledChartValue>
                  ) : (
                    <Skeleton width="128px" height="36px" />
                  )}
                </div>
              </StyledChartHeader>
              <Box height="250px">
                <LineChart
                  data={formattedLiquidityData}
                  setHoverValue={setLiquidityHover}
                  setHoverDate={setLiquidityDateHover}
                  customMainColor={theme.colors.itemPrimary}
                  customXAxisColor={theme.isDark ? '#fff' : '#000'}
                  customYAxisColor={theme.isDark ? '#fff' : '#000'}
                />
                {/* <TradingView id="pcs-chart-liquidity" symbol="EIGHTCAP:CAKEUSD" /> */}
              </Box>
            </StyledBoxForChart>
          </StyledCardForChart>

          <StyledCardForChart>
            <StyledBoxForChart
              $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
              $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#EBEBEB'}
              p={['16px', '16px', '24px']}
            >
              <StyledChartHeader>
                <div>
                  <StyledChartTitle bold color="itemPrimary">
                    {t('Volume 24H')}
                  </StyledChartTitle>
                  <StyledChartDate $isDarkStyle={theme.isDark}>{volumeDateHover ?? currentDate}</StyledChartDate>
                </div>
                <div>
                  {volumeHover > 0 ? (
                    <StyledChartValue bold color="itemPrimary" fontSize="24px">
                      ${formatAmount(volumeHover)}
                    </StyledChartValue>
                  ) : (
                    <Skeleton width="128px" height="36px" />
                  )}
                </div>
              </StyledChartHeader>
              <Box height="250px">
                <BarChart
                  data={formattedVolumeData}
                  setHoverValue={setVolumeHover}
                  setHoverDate={setVolumeDateHover}
                  customMainColor={theme.colors.itemBlueHighlight}
                  customXAxisColor={theme.isDark ? '#fff' : '#000'}
                  customYAxisColor={theme.isDark ? '#fff' : '#000'}
                />
              </Box>
            </StyledBoxForChart>
          </StyledCardForChart>
        </ChartCardsContainer>
      </StyledSection>

      <StyledSection>
        <StyledHeading color="itemPrimary" scale="lg" mt="40px" mb="16px">
          {t('Top Tokens')}
        </StyledHeading>
        <TokenTable tokenDatas={formattedTokens} />
      </StyledSection>

      <StyledSection>
        <StyledHeading color="itemPrimary" scale="lg" mt="40px" mb="16px">
          {t('Top Pools')}
        </StyledHeading>
        <PoolTable poolDatas={poolDatas} loading={somePoolsAreLoading} />
      </StyledSection>

      <StyledSection>
        <TransactionTable transactions={transactions} headingContent={t('Transactions')} />
      </StyledSection>
    </Page>
  )
}

export default Overview
