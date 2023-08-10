import { Box, ButtonMenu, ButtonMenuItem, Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import Search from 'views/Info/components/InfoSearch'

const NavWrapper = styled(Flex)`
  // background: ${({ theme }) => theme.colors.gradients.cardHeader};
  background: transparent;
  justify-content: space-between;
  padding: 30px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px 40px;
    flex-direction: row;
  }

  // Make NavWrapper has the same size as Info page:
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;

  @media screen and (min-width: 370px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media screen and (max-width: 576px) {
    align-items: center;
  }
`

const StyledButtonMenu = styled(ButtonMenu)`
  background: transparent;
  border: none;
  outline: none;
  flex-wrap: wrap;
  @media screen and (max-width: 992px) {
    justify-content: flex-start;
    align-items: flex-start;
  }
`

const StyledButtonMenuItem = styled(ButtonMenuItem) <{
  $isActive?: boolean,
  $txtColor?: string,
  $bgColor?: string,
  $bgColorUnchecked?: string
}>`
  background: ${(props) => props.$bgColorUnchecked};
  border-radius: 30px;
  margin-right: 20px;
  width: 180px;
  height: 52px;
  // Layout:
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 30px;
  // Content:
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  flex: none;
  order: 0;
  flex-grow: 0;

  &&:last-child {
    margin-right: 0;
  }

  &&:hover {
    backdrop-filter: blur(10px);
    color: ${(props) => props.$txtColor || ''};
    background: ${(props) => `${props.$bgColor}99` || ''};
  }

  ${(props) =>
    props.$isActive &&
    css`
      color: ${props.$txtColor || ''};
      background: ${props.$bgColor || ''};

      &&:hover {
        background: ${props.$bgColor || ''};
      }
    `}
    @media screen and (max-width: 992px) {
      width: 100%;
      margin: 0 0 8px 0;
      padding: 8px;
      height: 48px;
    }
`

const InfoNav = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const isPools = router.asPath === '/info/pools'
  const isTokens = router.asPath === '/info/tokens'
  let activeIndex = 0
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  return (
    <NavWrapper>
      <Box>
        <StyledButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
          <StyledButtonMenuItem
            as={NextLinkFromReactRouter} to="/info"
            $isActive={activeIndex === 0}
            $txtColor='#fff'
            $bgColor={theme.colors.itemPrimary}
            $bgColorUnchecked={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
          >
            {t('Overview')}
          </StyledButtonMenuItem>
          <StyledButtonMenuItem
            as={NextLinkFromReactRouter} to="/info/pools"
            $isActive={activeIndex === 1}
            $txtColor='#fff'
            $bgColor={theme.colors.itemPrimary}
            $bgColorUnchecked={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
          >
            {t('Pools')}
          </StyledButtonMenuItem>
          <StyledButtonMenuItem
            as={NextLinkFromReactRouter} to="/info/tokens"
            $isActive={activeIndex === 2}
            $txtColor='#fff'
            $bgColor={theme.colors.itemPrimary}
            $bgColorUnchecked={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
          >
            {t('Tokens')}
          </StyledButtonMenuItem>
        </StyledButtonMenu>
      </Box>
      <Box width={['100%', '100%', '250px']} style={{ width: '340px', height: '52px' }}>
        <Search />
      </Box>
    </NavWrapper>
  )
}

export default InfoNav
