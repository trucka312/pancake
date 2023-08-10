import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const StyledCard = styled(Card) <{ isFinished?: boolean, cBgColor?: string, cBorderColor?: string, isDark?: boolean }>`
  max-width: 352px;
  margin: 0 8px 24px;
  width: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  // Custom style:
  background: ${({ isDark }) => isDark ? '#1e2735' : '#fff'};
  background: ${({ cBgColor }) => cBgColor || ''};
  border: 1px solid #60C5BA;
  border-radius: 10px;
  padding: 0;

  && > div {
    background: none;
    border-radius: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export default StyledCard
