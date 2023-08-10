import { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Box, CardProps } from '@pancakeswap/uikit'

const StyledCard = styled(Card) <{
  background?: string
  borderImage?: string
  rotation?: string
}>`
  height: fit-content;
  box-sizing: border-box;
  padding: 0;

  ${({ background }) => (background ? `background: ${background};` : '')}
  
  ${({ borderImage }) => (borderImage ? `
    border: 1px solid;
    border-image-source: ${borderImage};
    border-image-slice: 1;
    border-radius: 5px;
  ` : '')}

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

const StyledCardBody = styled(CardBody)`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`

const IconWrapper = styled(Box) <{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  top: 24px;
  left: 50%;
  bottom: auto;
  right: auto;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }

  svg {
    width: 80px;
    height: 80px;
  }
`

interface IconCardProps extends IconCardData, CardProps {
  children: ReactNode
  borderColor?: string
  borderImage?: string
  hasMainIcon?: boolean
}

export interface IconCardData {
  icon: ReactNode
  background?: string
  borderColor?: string
  rotation?: string
}

const IconCard: React.FC<IconCardProps> = ({
  icon,
  background,
  borderImage,
  rotation,
  children,
  hasMainIcon = true,
  ...props
}) => {
  return (
    <StyledCard
      background={background}
      borderImage={borderImage}
      rotation={rotation}
      {...props}
    >
      <StyledCardBody>
        {hasMainIcon ? <IconWrapper rotation={rotation}>{icon}</IconWrapper> : <></>}
        {children}
      </StyledCardBody>
    </StyledCard>
  )
}

export default IconCard
