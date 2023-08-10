import styled, { css } from 'styled-components'
import { Box, Heading, Text, Button, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useTheme from 'hooks/useTheme'

const StyledHero = styled(Box)`
  // background-image: url('/images/ifos/assets/ifo-banner-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.png');
  // background-position: top, center;
  // background-repeat: no-repeat;
  // background-size: auto 100%;
  display: block;
  padding: 0;
  margin: 30px 0;
`

const StyledContainer = styled(Container)`
  @media screen and (min-width: 370px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const StyledHeroContentWrapper = styled.div <{ $bgColor?: string, $borderColor?: string }>`
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$borderColor};
  box-sizing: border-box;
  border-radius: 10px;
  padding: 30px;
`

const StyledHeading = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  margin-bottom: 8px;
`

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 12px;
  height: auto;
  text-transform: uppercase;
  align-self: flex-start;
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 8px;
  margin: 24px 0 24px 0;
`

const DesktopButton = styled(Button)`
  // align-self: flex-end;
  // // Custom button style:
  // background: #EC4C93;
  // border: 1px solid #EC4C93;
  // box-sizing: border-box;
  // border-radius: 300px;
  // padding: 18px 40px;
  // border: none; outline: none;
  // // Custom content style:
  // font-size: 20px;
  // line-height: 20px;
  // text-transform: uppercase;
  // color: #fff;
  // font-weight: 400;
`

const StyledSubTitle = styled(Text)`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 24px;
  margin: 0;
`

const StyledNavButtonList = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
`

const StyledNavButton = styled.div<{
  $isActive?: boolean,
  $txtColor?: string,
  $bgColor?: string,
  $bgColorActive?: string,
  $borderColor?: string,
  $borderColorActive?: string
}>`
  color: ${(props) => props.$txtColor};
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  background: blue;
  padding: 18px 40px;
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$borderColor};
  box-sizing: border-box;
  border-radius: 300px;
  margin: 0 14px 0 0;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  ${(props) => props.$isActive && css`
    &&,
    &&:hover {
      background: ${props.$bgColorActive};
      border: 1px solid ${props.$borderColorActive};
    }
  `}

  @media screen and (max-width: 576px) {
    width: 100%;
    margin: 0 0 14px 0;
  }
`

const Hero = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  const currentRoute = router.route

  const handleClick = () => {
    const howToElem = document.getElementById('ifo-how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    } else {
      router.push('/ifo#ifo-how-to')
    }
  }

  return (
    <Box mb="0px">
      <StyledHero>
        <StyledContainer>
          <StyledHeroContentWrapper
            $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
            $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
          >
            <Flex
              justifyContent="space-between"
              flexDirection={['column', 'column', 'column', 'row']}
              style={{ gap: '4px' }}
            >
              <Box>
                <StyledHeading color={theme.colors.itemPrimary} as="h1" mb={['12px', '12px', '16px']}>
                  {t('IFO: Initial Farm Offerings')}
                </StyledHeading>
                <StyledSubTitle color={theme.isDark ? '#fff' : '#6E6E6E'} bold>
                  {t('Buy new tokens launching on BNB Smart Chain')}
                  <div>{isMobile && <StyledButton onClick={handleClick}>{t('How does it work?')}</StyledButton>}</div>
                </StyledSubTitle>
              </Box>

              <StyledNavButtonList>
                <Link href="/ifo" passHref>
                  <StyledNavButton
                    $isActive={currentRoute === '/ifo'}
                    $txtColor='#fff'
                    $bgColor={theme.colors.bgDark}
                    $bgColorActive={theme.colors.itemPrimary}
                    $borderColor={theme.colors.itemBlueUnhighlight}
                    $borderColorActive={theme.colors.itemPrimary}
                  >{t('Latest')}</StyledNavButton>
                </Link>
                <Link href="/ifo/history" passHref>
                  <StyledNavButton
                    $isActive={currentRoute === '/ifo/history'}
                    $txtColor='#fff'
                    $bgColor={theme.colors.bgDark}
                    $bgColorActive={theme.colors.itemPrimary}
                    $borderColor={theme.colors.itemBlueUnhighlight}
                    $borderColorActive={theme.colors.itemPrimary}
                  >{t('Finished')}</StyledNavButton>
                </Link>

                {/* {!isMobile && (
                  <DesktopButton onClick={handleClick} variant="subtle">
                    {t('How does it work?')}
                  </DesktopButton>
                )} */}
              </StyledNavButtonList>
            </Flex>
          </StyledHeroContentWrapper>
        </StyledContainer>
      </StyledHero>
    </Box>
  )
}

export default Hero
