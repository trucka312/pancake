import styled, { css } from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Hero from './components/Hero'
import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import WinSection from './components/WinSection'
import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'
// import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
// import UserBanner from './components/UserBanner'
// import MultipleBanner from './components/Banners/MultipleBanner'

const StyledHeroSection = styled(PageSection)`
  background-image: url('/imagesForOnDefi/home/OnDefi_Home_Hero.png');
  background-size: 100vw auto;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(768px - 57px);
  max-height: calc(1080px - 57px);
  height: calc(100vh - 57px);
  overflow: hidden;
  padding: 40px 0;
  margin-bottom: 100px;

  > div {
    // transform: translateX(-2vw);
    padding: 40px 40px 40px 40px;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;
  }

  @media screen and (max-width: 768px) {
    > div {
      transform: translateX(0);
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledMetricsSection = styled(PageSection)`
  background: transparent;
  min-height: 768px;
  max-height: 1080px;
  height: 100vh;
  overflow: hidden;
  padding: 40px 0;
  margin-bottom: 100px;

  > div {
    overflow: hidden;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 992px) {
    background-size: auto 60vh;
    height: auto; max-height: none;
  }

  @media screen and (max-width: 768px) {
    background-size: auto 50vh;
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledSwapSection = styled(PageSection)`
  background-image: url('/imagesForOnDefi/home/OnDefi_Home_Swap.png');
  background-size: 100vw auto;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 768px;
  max-height: 1080px;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 992px) {
  }

  @media screen and (max-width: 768px) {
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledSalesSection = styled(PageSection)`
  background-image: url('/imagesForOnDefi/home/OnDefi_Home_Trade2.png');
  background-size: 100vw auto;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 768px;
  max-height: 1080px;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 72px 40px 40px 40px;
    }
  }

  @media screen and (max-width: 992px) {
    height: auto; max-height: none;
  }

  @media screen and (max-width: 768px) {
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledWinSection = styled(PageSection)`
  background-image: url('/imagesForOnDefi/home/OnDefi_Home_Win.png');
  background-size: 100vw auto;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 768px;
  max-height: 1080px;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 1200px) {
    height: auto; max-height: none;
  }

  @media screen and (max-width: 992px) {
  }

  @media screen and (max-width: 768px) {
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledTokenSection = styled(PageSection)`
  background-image: url('/imagesForOnDefi/home/OnDefi_Home_Token.png');
  background-size: 100vw auto;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 768px;
  max-height: 1080px;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 992px) {
  }

  @media screen and (max-width: 768px) {
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;
    height: auto; max-height: none;

    && > div {
      padding: 20px;
    }
  }
`

const StyledHomeFooter = styled(PageSection)`
  max-height: calc(100vh);
  background: transparent;
  padding: 60px 0;
  background: #0B3854;
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const HomeWrapper = styled.div <{ $isDarkStyle?: boolean }>`
  ${(props) => props.$isDarkStyle ? css`
    background-color: #101722;
  ` : css`
    background-color: #fff;
  `}

  @media screen and (max-width: 1366px) {
    font-size: 23px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()

  // const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }
  const HomeSectionContainerStyles = { margin: '0', width: '100%' }

  const { t } = useTranslation()

  return (
    <HomeWrapper $isDarkStyle={theme.isDark}>
      <PageMeta />
      <StyledHeroSection
        innerProps={{ style: { margin: '0' } }}
        background={
          theme.isDark
            ? 'radial-gradient(103.12% 50% at 50% 50%, #21193A 0%, #191326 100%)'
            : 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && <UserBannerWrapper>{/* <UserBanner /> */}</UserBannerWrapper>}
        {/* <MultipleBanner /> */}
        <Hero />
      </StyledHeroSection>

      <StyledMetricsSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #09070C 22%, #201335 100%)'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
        }
        index={2}
        hasCurvedDivider={false}
        style={{ background: 'transparent' }}
      >
        <MetricsSection />
      </StyledMetricsSection>

      <StyledSwapSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...swapSectionData(t)} numberOfWords={2} />
      </StyledSwapSection>

      <StyledSalesSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
        style={{ backgroundColor: 'transparent' }}
      >
        <SalesSection {...earnSectionData(t)} numberOfWords={3} layoutType='to-left' />
        <FarmsPoolsRow />
      </StyledSalesSection>

      <StyledWinSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
            : 'linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <WinSection />
      </StyledWinSection>

      <StyledTokenSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
        style={{ backgroundColor: 'transparent' }}
      >
        <SalesSection {...cakeSectionData(t)} numberOfWords={1} layoutType='to-left' />
        <CakeDataRow />
      </StyledTokenSection>

      <StyledHomeFooter
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </StyledHomeFooter>
    </HomeWrapper>
  )
}

export default Home
