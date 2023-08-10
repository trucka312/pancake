import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useState, memo } from 'react'
// import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { useFetchPairPrices } from 'state/swap/hooks'
import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
import PairPriceDisplay from '../../../../components/PairPriceDisplay'
import { getTimeWindowChange } from './utils'

const SwapLineChart = dynamic(() => import('./SwapLineChart'), {
  ssr: false,
})

const ParentChart = styled.div`
  :first-child {
    button {
      background-color: #60C5BA;
      color: #fff;
    }
    button.sc-bkkeKt.eGBDrg {
      background-color: transparent !important;
      color: #60C5BA;
    }
  }
`
// interface TradingViewProps {
//   id: string
//   symbol: string
// }

const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  inputCurrency,
  outputCurrency,
  isMobile,
  currentSwapPrice,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)
  // const { isDark } = useTheme()

  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  })
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
  const isChangePositive = changeValue >= 0
  const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '378px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    )

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }

  // useScript('https://s3.tradingview.com/tv.js')
  // const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme, localeCode: string, opts: any) => {
  //   let timezone = 'Etc/UTC'
  //   try {
  //     timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  //   } catch (e) {
  //     // noop
  //   }
  //   /* eslint-disable new-cap */
  //   /* eslint-disable no-new */
  //   // @ts-ignore
  //   return new TradingViewObj.widget({
  //     // Advanced Chart Widget uses the legacy embedding scheme,
  //     // an id property should be specified in the settings object
  //     width: 'auto',
  //     height: '100%',
  //     symbol: 'BINANCE:BNBUSDT',
  //     interval: "D",
  //     timezone,
  //     theme: "dark",
  //     style: "1",
  //     locale: "vi_VN",
  //     toolbar_bg: "#f1f3f6",
  //     enable_publishing: false,
  //     hide_top_toolbar: true,
  //     allow_symbol_change: true,
  //     container_id: "tradingview_82ac1"
  //   })
  // }

  // const tradingViewListener = async () =>
  //   new Promise<void>((resolve) =>
  //     Object.defineProperty(window, 'TradingView', {
  //       configurable: true,
  //       set(value) {
  //         this.tv = value
  //         resolve(value)
  //       },
  //     }),
  //   )

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px"
      >
        <Flex flexDirection="column" pt="12px">
          <PairPriceDisplay
            value={pairPrices?.length > 0 && valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
          >
            <Text color="#60C5BA" fontSize="20px" ml="4px" bold mt="-8px" mb="8px">
              {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
            </Text>
          </PairPriceDisplay>
          <Text small color='light'>
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box>
          <ParentChart>
            <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
              <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
            </ButtonMenu>
          </ParentChart>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} p={isMobile ? '0px' : '16px'} width="100%">
        <SwapLineChart
          data={pairPrices}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default memo(BasicChart, (prev, next) => {
  return (
    prev.token0Address === next.token0Address &&
    prev.token1Address === next.token1Address &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isMobile === next.isMobile &&
    prev.isChartExpanded === next.isChartExpanded &&
    ((prev.currentSwapPrice !== null &&
      next.currentSwapPrice !== null &&
      prev.currentSwapPrice[prev.token0Address] === next.currentSwapPrice[next.token0Address] &&
      prev.currentSwapPrice[prev.token1Address] === next.currentSwapPrice[next.token1Address]) ||
      (prev.currentSwapPrice === null && next.currentSwapPrice === null))
  )
})
