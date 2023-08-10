// import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled, { css } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
// import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'
import { BasicButton } from '../../../../packages/uikit/src/components/Button/index.stories'

const StyledHeroHeading = styled.div <{ $isDarkStyle?: boolean }>`
  color: #000;
  font-size: 64px;
  line-height: 100%;
  font-style: normal;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #0b3854;
  `}

  @media screen and (max-width: 1400px) {
    font-size: 50px;
    line-height: 53px;
  }

  @media screen and (max-width: 576px) {
    font-size: 35px;
    line-height: 38px;
  }
`
const StyledHeroIntroText = styled.div <{ $isDarkStyle?: boolean }>`
  color: #000;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 100%;
  text-align: center;
  margin-bottom: 30px;
  max-width: 650px;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #000;
  `}

  @media screen and (max-width: 1400px) {
    max-width: 500px;
  }

  @media screen and (max-width: 576px) {
  }
`

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        // mt={[account ? '280px' : '50px', null, 0]}
        id="homepage-hero"
      > 
        <Flex flex="1" flexDirection="column" style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <StyledHeroHeading $isDarkStyle={theme.isDark}>
            <div>{t('The moon is made of ')}</div>
            {/* <BasicText color='tomato'>
              OnDefi.
            </BasicText> */}
            <span style={{ color: '#60c5ba' }}>OnDefi.</span>
          </StyledHeroHeading>

          <StyledHeroIntroText $isDarkStyle={theme.isDark}>
            {t('Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.')}
          </StyledHeroIntroText>

          <Flex style={{ justifyContent: 'center', alignItems: 'center' }}>
            <NextLinkFromReactRouter to="/swap" style={{ marginRight: '30px' }}>
              <BasicButton variant='customSecondary'>
                {t('Trade Now')}
              </BasicButton>
            </NextLinkFromReactRouter>
            {!account && <ConnectWalletButton variant='customPrimary' mr="0px" />}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
