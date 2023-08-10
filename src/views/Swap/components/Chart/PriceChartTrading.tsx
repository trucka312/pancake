import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  Button,
  ExpandIcon,
  Flex,
  Box,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  useModal,
  TradingViewIcon,
  LineGraphIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager, useUserSlippageTolerance } from 'state/user/hooks'
import { useCurrency, useAllTokens } from '../../../../hooks/Tokens'
import styled from 'styled-components'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState, useDefaultsFromURLSearch } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import SwapWarningModal from '../SwapWarningModal'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import TradingViewChart from './TradingViewChart'
import { StyledPriceChart } from './styles'

const PriceChartTrading = ({
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

  const [chartView, setChartView] = useExchangeChartViewManager()
  const [twChartSymbol, setTwChartSymbol] = useState('')
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  }
  const loadedUrlParams = useDefaultsFromURLSearch()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)

  const handleTwChartSymbol = useCallback((symbol) => {
    setTwChartSymbol(symbol)
  }, [])

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
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
    recipient,
  )
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
  const { onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

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

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      return swapCurrency.address === warningTokenData.address
    })
    return Boolean(isWarningToken)
  }
  const [tempPacth, setTempPatch] = useState(null)
  const handleInputSelect = useCallback(
    (currencyInput) => {
      setTempPatch(currencyInput)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])
  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  useEffect(() => {
    setChartView(ChartViewMode.TRADING_VIEW)
  }, [chartView])

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? '100%' : '100%'}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      style={{ padding: '10px', border: '1px solid #60C5BA' }}
      $isFullWidthContainer={isFullWidthContainer}
      id="price_trading_chart"
    >
      <Flex flexDirection="column" justifyContent="space-between" height={isChartExpanded ? '700px' : '500px'} pt="12px">
        <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
          {twChartSymbol && <TradingViewLabel symbol={twChartSymbol} />}
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" ml="10px">
            <CurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
              isShow={false}
            />
          </Flex>
          <Flex>
            {!isMobile && (
              <Flex>
                <IconButton variant="text" onClick={toggleExpanded}>
                  {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="#60C5BA" />}
                </IconButton>
              </Flex>
            )}
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
          isChartExpanded={isChartExpanded}
        />
      </Flex>
    </StyledPriceChart>
  )
}

export default PriceChartTrading
