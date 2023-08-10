import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import Container from '../Layout/Container'
import { PageHeaderProps } from './types'

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ background }) => background || 'rgba(0,0,0,0.6)'};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<PageHeaderProps> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
