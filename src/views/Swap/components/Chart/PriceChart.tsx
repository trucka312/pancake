import { useState, useCallback, useEffect } from 'react'
import {
  Button,
  ExpandIcon,
  Flex,
  Box,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  TradingViewIcon,
  LineGraphIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager, useUserSlippageTolerance } from 'state/user/hooks'
import styled from 'styled-components'
import { CurrencyAmount } from '@pancakeswap/sdk'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import TradingViewChart from './TradingViewChart'
import { StyledPriceChart } from './styles'
import BasicChart from './BasicChart'
import useTheme from 'hooks/useTheme'

const ChartButton = styled(Button)<{ $isDark: boolean }>`
  // background-color: ${({ $active, theme }) => $active && `${theme.colors.primary}0f`};
  ${({ theme }) => theme.mediaQueries.sm} {
    background-color: ${({ $isDark }) => ($isDark ? '#0B3854' : '#fff')};
    border: 1px solid ${({ $isDark }) => ($isDark ? 'transparent' : '#0B3854')};
  }
  color: #60c5ba;
  padding: 4px 8px;
  border-radius: 5px;
`

const BIcon = styled(Button)<{ $isDark: boolean }>`
  ${({ theme }) => theme.mediaQueries.sm} {
    background-color: ${({ $isDark }) => ($isDark ? '#0B3854' : '#fff')};
    border: 1px solid ${({ $isDark }) => ($isDark ? 'transparent' : '#0B3854')};
  }
  width: 32px;
  height: 32px;
  border-radius: 5px !important;
  display: inline-block;
  padding: 0px 20px 0px 0px !important;
`

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  isFullWidthContainer,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const toggleExpanded = () => {
    setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  }
  const [chartView, setChartView] = useExchangeChartViewManager()
  const [propChart, setPropChart] = useState(false)
  const [twChartSymbol, setTwChartSymbol] = useState('')
  const { t } = useTranslation()

  const handleTwChartSymbol = useCallback((symbol) => {
    setTwChartSymbol(symbol)
  }, [])
  const StypeParent = styled(Box)<{ $isDark: boolean }>`
    ${({ theme }) => theme.mediaQueries.sm} {
      background: ${({ $isDark }) => ($isDark ? '#0B3854' : '#fff')};
    }
  `

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue } = useSwapState()
  // Price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    '',
  )
  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
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
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])
  const [approval] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  useEffect(() => {
    if (window.innerWidth <= 442) {
      setPropChart(true)
      setChartView(ChartViewMode.TRADING_VIEW)
    }
  })

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      return swapCurrency.address === warningTokenData.address
    })
    return Boolean(isWarningToken)
  }
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const handleInputSelect = useCallback(
    (inputCurrencyValue) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrencyValue)
      const showSwapWarning = shouldShowSwapWarning(inputCurrencyValue)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrencyValue)
      } else {
        setSwapWarningCurrency(null)
        swapWarningCurrency
      }
    },
    [onCurrencySelection],
  )

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? '100%' : '90%'}
      overflow={chartView === ChartViewMode.TRADING_VIEW ? 'hidden' : 'unset'}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      style={{ padding: '10px' }}
      $isFullWidthContainer={isFullWidthContainer}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          <StypeParent $isDark={isDark} style={{ display: 'flex', padding: '5px', borderRadius: '5px' }}>
            {outputCurrency ? (
              <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
            ) : (
              inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
            )}
            {inputCurrency && (
              <Text color="#60C5BA" bold>
                {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
              </Text>
            )}
          </StypeParent>
          <IconButton variant="text" onClick={onSwitchTokens}>
            <BIcon $isDark={isDark}>
              <SyncAltIcon ml="6px" color="#60C5BA" />
            </BIcon>
          </IconButton>
          {propChart ? (
            <></>
          ) : (
            <>
              <Flex>
                <ChartButton
                  $isDark={isDark}
                  aria-label={t('Basic')}
                  title={t('Basic')}
                  $active={chartView === ChartViewMode.BASIC}
                  scale="sm"
                  variant="text"
                  color="primary"
                  onClick={() => setChartView(ChartViewMode.BASIC)}
                  mr="8px"
                >
                  {isDesktop ? t('Basic') : <LineGraphIcon color="primary" />}
                </ChartButton>
                <ChartButton
                  $isDark={isDark}
                  aria-label="TradingView"
                  title="TradingView"
                  $active={chartView === ChartViewMode.TRADING_VIEW}
                  scale="sm"
                  variant="text"
                  onClick={() => setChartView(ChartViewMode.TRADING_VIEW)}
                >
                  {isDesktop ? 'TradingView' : <TradingViewIcon color="primary" />}
                </ChartButton>
              </Flex>
            </>
          )}
        </Flex>
        {propChart ? (
          <></>
        ) : (
          <>
            {!isMobile && (
              <Flex>
                <IconButton variant="text" onClick={toggleExpanded}>
                  {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="#0B3854" />}
                </IconButton>
              </Flex>
            )}
          </>
        )}
      </Flex>
      {chartView === ChartViewMode.BASIC && (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
      )}
      {chartView === ChartViewMode.TRADING_VIEW && (
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 48px)' : '458px'}
          pt="12px"
        >
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
            {/* <PairPriceDisplay
              value={currentSwapPrice?.[token0Address]}
              inputSymbol={inputCurrency?.symbol}
              outputSymbol={outputCurrency?.symbol}
              mx="24px"
            /> */}
            {twChartSymbol && <TradingViewLabel symbol={twChartSymbol} />}
            <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" ml="10px">
              {/* <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                isShow={false}
              /> */}
            </Flex>
          </Flex>

          <TradingViewChart
            // unmount the whole component when symbols is changed
            key={`${inputCurrency?.symbol}-${outputCurrency?.symbol}`}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
            isDark={isDark}
            onTwChartSymbol={handleTwChartSymbol}
            id={isDark}
            symbol={isDark}
            valueSymbol={currencies[Field.INPUT]?.symbol}
            valueSymbol2={currencies[Field.OUTPUT]?.symbol}
          />
        </Flex>
      )}
    </StyledPriceChart>
  )
}

export default PriceChart
