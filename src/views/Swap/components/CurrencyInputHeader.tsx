import styled from 'styled-components'
import {
  ChartIcon,
  Flex,
  Heading,
  HistoryIcon,
  IconButton,
  NotificationDot,
  Text,
  useModal,
  ChartDisableIcon,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import RefreshIcon from 'components/Svg/RefreshIcon'

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const CurrencyInputContainer = styled(Flex)<{ $isDark: boolean }>`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#1E2735' : '#fff')};
  }
`

const ColoredIconButton = styled(IconButton)`
  color: #60C5BA;
`

const CurrencyInputHeader: React.FC<Props> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const { isDark } = useTheme()
  return (
    <CurrencyInputContainer $isDark={isDark}>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        {setIsChartDisplayed && (
          <ColoredIconButton onClick={toggleChartDisplayed} variant="text" scale="sm">
            {isChartDisplayed ? <ChartDisableIcon color="#0B3854" /> : <ChartIcon width="24px" color="textSubtle" />}
          </ColoredIconButton>
        )}
        <Flex flexDirection="column" alignItems="flex-end" width="100%" mr={18}>
          <Heading as="h2" color="#60C5BA">
            {title}
          </Heading>
        </Flex>
        <Flex>
          <NotificationDot show={expertMode}>
            <GlobalSettings color="#0B3854" mr="0" />
          </NotificationDot>
          <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
            <HistoryIcon color="#0B3854" width="24px" />
          </IconButton>
          <IconButton variant="text" scale="sm" onClick={() => onRefreshPrice()}>
            <RefreshIcon disabled={!hasAmount} color="#0B3854" width="27px" />
          </IconButton>
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <Text color={isDark ? '#fff' : '#000'} fontSize="14px">
          {subtitle}
        </Text>
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
