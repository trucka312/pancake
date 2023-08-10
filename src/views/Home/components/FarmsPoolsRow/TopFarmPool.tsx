import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

interface TopFarmPoolProps {
  title: ReactNode
  percentage: number
  index: number
  visible: boolean
  style?: any
}

const StyledWrapper = styled(Flex) <{ index: number }>`
  position: relative;

  @media screen and (max-width: 768px) {
    && {
      min-width: 167px;
    }
  }
`

const AbsoluteWrapper = styled(Flex) <{ visible: boolean; index: number; topOffset: string }>`
  position: absolute;
  top: ${({ topOffset }) => topOffset};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : `50%`)};
  transition: opacity, margin-top, 0.4s ease-out;
  flex-direction: column;
  padding: 16px 20px;
  width: 100%;
  background: linear-gradient(115.97deg, rgba(96, 197, 186, 0) 1.04%, rgba(96, 197, 186, 0.54) 100%);
  // border: 1px solid;
  // border-image-source: linear-gradient(180deg, #60C5BA 0%, rgba(96, 197, 186, 0) 100%);
  // border-image-slice: 1;
  border-radius: 10px;
  // max-height: 163px;
  min-height: 163px;

  ${({ index, theme }) =>
    index > 0
      ? `
         ${theme.mediaQueries.sm} {
           height: auto;
           top: 0;
         }
       `
      : ``}

  ::before {
    content: "";
    position: absolute;
    border-radius: 10px;
    // Change to "padding: 10px" to know why?
    // padding: 10px;
    padding: 1px;
    inset: 0;
    background: linear-gradient(180deg, #60C5BA 0%, rgba(96, 197, 186, 0) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
  }
`

const StyledTextTitle = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  text-align: center;
  color: #60c5ba;
  align-self: center;
  margin: 0;
`

const StyledTextBalance = styled(Balance) <{ $isDarkStyle?: boolean }>`
  font-style: normal;
  text-align: center;
  color: #000;
  font-weight: 500;
  font-size: 32px;
  line-height: 44px;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #0b3854;
  `}
`

const StyledTextSubtle = styled(Text) <{ $isDarkStyle?: boolean }>`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #000;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #0b3854;
  `}
`

const StyledAbsoluteWrapper = styled(AbsoluteWrapper)`
  @media screen and (max-width: 576px) {
    backdrop-filter: blur(5px);
  }
`

const TopFarmPool: React.FC<TopFarmPoolProps> = ({ title, percentage, index, visible, style }) => {
  const { t } = useTranslation()

  const { theme } = useTheme()

  const topOffset = () => {
    if (index >= 0 && index < 2) {
      // return '0px'
    }

    if (index >= 2 && index < 3) {
      // return '80px'
    }

    // return '160px'
    return '0px'
  }

  return (
    <StyledWrapper index={index} style={style}>
      <StyledAbsoluteWrapper index={index} visible={visible} topOffset={topOffset()}>
        {title ? (
          <StyledTextTitle bold mb="8px" fontSize="12px" color="secondary">
            {title}
          </StyledTextTitle>
        ) : (
          <Skeleton width={80} height={12} mb="8px" />
        )}
        {percentage ? (
          <StyledTextBalance $isDarkStyle={theme.isDark} lineHeight="1.1" fontSize="16px" bold unit="%" value={percentage} />
        ) : (
          <Skeleton width={60} height={16} />
        )}
        {percentage ? (
          <StyledTextSubtle $isDarkStyle={theme.isDark} fontSize="16px" color="textSubtle">
            {t('APR')}
          </StyledTextSubtle>
        ) : (
          <Skeleton width={30} height={16} mt="4px" />
        )}
      </StyledAbsoluteWrapper>
    </StyledWrapper>
  )
}

export default TopFarmPool
