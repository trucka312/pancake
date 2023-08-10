import React, { useState, useEffect, useMemo } from 'react'
import { Box, useModal, useMatchBreakpoints, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import PriceChartContainerTrading from '../Chart/PriceChartContainerTrading'
import { useRouter } from 'next/router'
import { Field } from '../../../../state/swap/actions'
import { useCurrency, useAllTokens } from '../../../../hooks/Tokens'
import { CurrencyAmount, JSBI, Token, Trade } from '@pancakeswap/sdk'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
  useSingleTokenSwapInfo,
} from '../../../../state/swap/hooks'
import { useExchangeChartManager } from '../../../../state/user/hooks'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
import { isMobile } from 'react-device-detect'
import Page from '../../../Page'
import ActiveLink from '../ActiveLink'

const CurrenChart = styled.div<{
  $isExpanded: boolean
  $isFullWidthContainer?: boolean
}>`
  height: ${({ $isExpanded, $isFullWidthContainer }) => ($isFullWidthContainer || $isExpanded ? '50%' : '50%')};
  ${({ theme }) => theme.mediaQueries.sm} {
    height: ${({ $isExpanded, $isFullWidthContainer }) => ($isFullWidthContainer || $isExpanded ? '80%' : '60%')};
  }
`

const ParentChart = styled.div`
  display: block;
  padding: 0 10px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  .Box-sc-c4ec0fdf-0.Flex-sc-32d5f017-0.kpCmgA.fJYdYh {
    min-height: 550px;
    max-width: 1024px;
    height: 750px;
  }
`

const TradingView = ({ isFullWidthContainer }) => {
  const router = useRouter()
  // token warning stuff
  const { isMobile } = useMatchBreakpoints()
  const { independentField, typedValue } = useSwapState()
  // Price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { currencies, inputError: swapInputError } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    '',
  )
  // const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency,outputCurrencyId,outputCurrency)
  // const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  return (
    <>
      <div
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}
      >
        <ActiveLink route={router.route} />
      </div>
      <CurrenChart
        style={{ overflow: 'hidden', display: 'block' }}
        $isExpanded={isChartExpanded}
        $isFullWidthContainer={isFullWidthContainer}
        >
        <ParentChart>
          <Flex justifyContent="center" position="relative">
            <PriceChartContainerTrading
              inputCurrencyId={inputCurrencyId}
              inputCurrency={currencies[Field.INPUT]}
              outputCurrencyId={outputCurrencyId}
              outputCurrency={currencies[Field.OUTPUT]}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={true}
              currentSwapPrice={singleTokenPrice}
            />
          </Flex>
        </ParentChart>
      </CurrenChart>
    </>
  )
}
export default TradingView
