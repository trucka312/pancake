import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'

const InfoWrapper = styled.div`
  background-color: #fff;
`

export const InfoPageLayout = ({ children }) => {
  const { theme } = useTheme()

  return (
    <InfoWrapper style={{ backgroundColor: `${theme.isDark ? theme.colors.bgDark : theme.colors.bgBright}` }}>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      <InfoNav />
      {children}
    </InfoWrapper>
  )
}
