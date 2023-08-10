import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)<{ $isDark: boolean }>`
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#1E2735' : '#fff')};
  }
  #top-header-liquidity a svg{
    fill: #0B3854;
  }
`

const AppHeader: React.FC<Props> = ({ title, subtitle, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()
  const { isDark } = useTheme()

  return (
    <AppHeaderContainer $isDark={isDark}>
      <div style={{ width: '100%', display: 'block', textAlign: 'center' }} id='top-header-liquidity'>
        {backTo && (
          <Link passHref href={backTo}>
            <IconButton as="a" style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)'}}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          </Link>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px" style={{ color: '#60C5BA' }}>
            {title}
          </Heading>
          <div>
            <Text style={{ color: isDark ? '#fff' : '#7A6EAA' }} fontSize="14px" mt="5px">
              {subtitle}
            </Text>
            {/* {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />} */}
          </div>
        </Flex>
      </div>
      {!noConfig && (
        <Flex alignItems="center" style={{ position: 'absolute', top: '10%', right: '5%' }}>
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          <Transactions />
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
