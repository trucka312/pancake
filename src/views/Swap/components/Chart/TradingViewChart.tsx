import { Box, BunnyPlaceholderIcon, Flex, Text } from '@pancakeswap/uikit'
import TradingView, { useTradingViewEvent } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import useDebounce from 'hooks/useDebounce'
import { useCallback, useEffect, useMemo, useState, memo, useRef } from 'react'
import styled from 'styled-components'
import { DefaultTheme, useTheme } from 'styled-components'
import useScript from 'hooks/useScript'
import { BarChartLoader } from 'views/Info/components/ChartLoaders'
import { Field } from 'state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  useSingleTokenSwapInfo,
} from 'state/swap/hooks'
import { useCurrency, useAllTokens } from '../../../../hooks/Tokens'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'

interface TradingViewChartProps {
  outputSymbol: string
  inputSymbol: string
  isDark: boolean
  onTwChartSymbol?: (symbol: string) => void
  id: string
  symbol: string
  valueSymbol: string
  valueSymbol2: string
  isChartExpanded?: boolean
}
interface TradingViewProps {
  id: string
  symbol: string
}

const TradingViewWrapper = styled.div<{ $show: boolean }>`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.2s ease-in;
  height: 100%;
`

const LoadingWrapper = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ $isDark }) => ($isDark ? '#2E2E42' : '#F4FCFF')};
  }
`

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const ID = 'TV_SWAP_CHART'
// const SYMBOL_PREFIX = 'PANCAKESWAP:'

const TradingViewChart = ({
  outputSymbol,
  inputSymbol,
  isDark,
  onTwChartSymbol,
  id,
  symbol,
  valueSymbol,
  valueSymbol2,
  isChartExpanded,
}: TradingViewChartProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  const [hasNoData, setHasNoData] = useState(false)

  const symbols = useMemo(() => {
    if (!(inputSymbol && outputSymbol)) {
      return null
    }

    const input = bnbToWBNBSymbol(inputSymbol)
    const output = bnbToWBNBSymbol(outputSymbol)
    return `${input}${output}`
  }, [inputSymbol, outputSymbol])

  const onNoDataEvent = useCallback(() => {
    console.debug('No data from TV widget')
    setHasNoData(true)
  }, [])

  const onLoadedEvent = useCallback(() => {
    setIsLoading(false)
  }, [])

  useTradingViewEvent({
    id: ID,
    onNoDataEvent,
    onLoadedEvent,
  })

  /**
   *
   */
  const { independentField, typedValue } = useSwapState()
  // Price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    '',
  )
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  // swap state
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // debounce the loading to wait for no data event from TV widget.
  // we cover the loading spinner over TV, let TV try to load data from pairs
  // if there's no no-data event coming between the debounce time, we assume the chart is loaded
  const debouncedLoading = useDebounce(isLoading, 800)

  useEffect(() => {
    if (!(isLoading || debouncedLoading) && !hasNoData && symbols) {
      onTwChartSymbol(symbols)
    } else {
      onTwChartSymbol('')
    }
  }, [debouncedLoading, hasNoData, isLoading, onTwChartSymbol, symbols])

  //Background color
  let bTheme = 'dark'
  useEffect(() => {
    if (!isDark) {
      bTheme = 'light'
    } else {
      bTheme = 'dark'
    }
  })
  useScript('https://s3.tradingview.com/tv.js')
  const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme, localeCode: string, opts: any) => {
    let timezone = 'Etc/UTC'
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      // noop
    }
    /* eslint-disable new-cap */
    /* eslint-disable no-new */
    // @ts-ignore
    let currencySymbol = ''
    if(valueSymbol2){
      currencySymbol = 'BINANCE:' + valueSymbol + valueSymbol2
    }
    else{
      currencySymbol = 'BINANCE:' + valueSymbol + 'USDT'
    }
    return new TradingViewObj.widget({
      // Advanced Chart Widget uses the legacy embedding scheme,
      // an id property should be specified in the settings object
      width: 'auto',
      height: '100%',
      symbol: currencySymbol,
      interval: 'D',
      timezone,
      theme: bTheme,
      style: '1',
      locale: 'vi_VN',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      details: isChartExpanded,//Status Full width or 1/2 width
      hotlist: isChartExpanded,//volume increase or decrease
      calendar: isChartExpanded,//economic calendar
      container_id: 'tradingview_82ac1',
    })
  }

  const { currentLanguage } = useTranslation()
  const theme = useTheme()
  const widgetRef = useRef<any>()
  const tradingViewListener = async () =>
    new Promise<void>((resolve) =>
      Object.defineProperty(window, 'TradingView', {
        configurable: true,
        set(value) {
          this.tv = value
          resolve(value)
        },
      }),
    )

  useEffect(() => {
    const opts: any = {
      container_id: 'tradingview_82ac1',
      symbol,
    }
    // if (isMobile) {
    //   opts.hide_side_toolbar = true
    // }
    // @ts-ignore
    if (window.tv) {
      // @ts-ignore
      widgetRef.current = initializeTradingView(window.tv, theme, currentLanguage.code, opts)
    } else {
      tradingViewListener().then((tv) => {
        widgetRef.current = initializeTradingView(tv, theme, currentLanguage.code, opts)
      })
    }

    // Ignore isMobile to avoid re-render TV
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, id, symbol])

  return (
    <Box height="100%" width="100%" pt="4px" pb="10px" position="relative">
      {/* {hasNoData && (
        <Flex height="100%" justifyContent="center" alignItems="center" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" height="96px" />
          <Text bold fontSize="20px" color="textDisabled" mt="16px">
            {t('TradingView chart not available')}
          </Text>
        </Flex>
      )}
      {(isLoading || debouncedLoading) && !hasNoData && (
        <LoadingWrapper $isDark={isDark}>
          <BarChartLoader />
        </LoadingWrapper>
      )}
      {!hasNoData && (
        <TradingViewWrapper $show={!isLoading}>
          {symbols && <TradingView id={ID} symbol={`${SYMBOL_PREFIX}${symbols}`} />}
        </TradingViewWrapper>
      )} */}
      <div className="tradingview-widget-container">
        <div id="tradingview_82ac1"></div>
      </div>
    </Box>
  )
}

export default memo(TradingViewChart)
