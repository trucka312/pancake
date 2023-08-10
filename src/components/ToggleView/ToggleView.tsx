import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@pancakeswap/uikit'
import { ViewMode } from 'state/user/actions'
import useTheme from 'hooks/useTheme'

interface ToggleViewProps {
  idPrefix: string
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ viewMode, onToggle }) => {
  const {isDark} = useTheme()
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }

  return (
    <Container>
      <IconButton variant="text" scale="sm" id="clickFarmCardView" onClick={() => handleToggle(ViewMode.CARD)}>
        <CardViewIcon
          color={viewMode === ViewMode.CARD ? '#60C5BA' : '#fff'}
          style={{ background: isDark ? '#000000' : 'rgba(96, 197, 186, 0.5)', borderRadius: '5px' }}
        />
      </IconButton>
      <IconButton variant="text" scale="sm" id="clickFarmTableView" onClick={() => handleToggle(ViewMode.TABLE)}>
        <ListViewIcon
          color={viewMode === ViewMode.TABLE ? '#60C5BA' : '#fff'}
          style={{ background: isDark ? '#000000' : 'rgba(96, 197, 186, 0.5)', borderRadius: '5px' }}
        />
      </IconButton>
    </Container>
  )
}

export default ToggleView
