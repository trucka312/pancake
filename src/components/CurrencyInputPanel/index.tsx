import { Currency, Pair } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
// import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { RowBetween } from 'components/Layout/Row'
// import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import { Input as NumericalInput } from './NumericalInput'

// const InputRow = styled.div<{ selected: boolean }>`
//   display: flex;
//   flex-flow: row nowrap;
//   align-items: center;
//   justify-content: flex-end;
//   padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
// `
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  position: relative;
  padding: 1.5rem 1rem;
  min-width: 120px;
  top: 23px;
  left: 10px;
  z-index: 3;
  background-color: #60c5ba;
  border-radius: 5px !important;
`

const CurrencySelectButtonTrue = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ $isDark: boolean }>`
  padding: 0.75rem 1rem;
  position: relative;
  top: 0px;
  left: 10px;
  z-index: 3;
  background-color: ${({ $isDark }) => ($isDark ? '#1E2735' : '#fff')};
  border: 1px solid #60c5ba;
  border-radius: 5px !important;
`

const LabelRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 1.5rem 1rem;
  border: 1.25px solid #60c5ba;
  border-radius: 15px;
  position: absolute;
  width: 100%;
  z-index: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
    background-color: ${({ $isDark }) => ($isDark ? '#101722' : '#fff')};
  }
  // background-color: ${({ theme }) => theme.colors.background};
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 15px;
  background-color: transparent;
  z-index: 1;
  height: 80px;
  margin-top: -40px;
`
const Container = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  isShow: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  // onMax,
  // showMaxButton,
  // label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  // hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  isShow,
}: CurrencyInputPanelProps) {
  // const { account } = useActiveWeb3React()
  // const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    // currentLanguage: { locale },
  } = useTranslation()
  const { isDark } = useTheme()

  // const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  // const tokenAddress = token ? isAddress(token.address) : null

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <Box position="relative" id={id}>
      <Flex mb="6px" alignItems="center" justifyContent="space-between">
        {isShow ? (
          <CurrencySelectButton
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between" style={{position: 'absolute'}}>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
        ) : (
          <CurrencySelectButtonTrue
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
            $isDark={isDark}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
            </Flex>{' '}
            {!disableCurrencySelect && <ChevronDownIcon />}
          </CurrencySelectButtonTrue>
        )}
        {/* <Flex style={{ gap: '8px' }}>
          {token && tokenAddress && library?.provider?.isMetaMask && (
            <MetamaskIcon
              style={{ cursor: 'pointer' }}
              width="16px"
              ml="6px"
              onClick={() => registerToken(tokenAddress, token.symbol, token.decimals)}
            />
          )}
          {account && (
            <Text onClick={onMax} color="textSubtle" fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
              {!hideBalance && !!currency
                ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                : ' -'}
            </Text>
          )}
        </Flex> */}
      </Flex>
      {isShow ? (
        <InputPanel>
          <Container>
            <LabelRow $isDark={isDark}>
              <RowBetween>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val)
                  }}
                />
              </RowBetween>
            </LabelRow>
            {/* <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow> */}
          </Container>
        </InputPanel>
      ) : (
        <></>
      )}
    </Box>
  )
}
