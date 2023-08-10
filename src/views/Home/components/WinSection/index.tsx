import styled, { css } from 'styled-components'
import { Flex, Text, TicketFillIcon, PredictionsIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import ColoredWordHeading from '../ColoredWordHeading'
import IconCard, { IconCardData } from '../IconCard'
import PredictionCardContent from './PredictionCardContent'
import LotteryCardContent from './LotteryCardContent'
import CompositeImage from '../CompositeImage'

// const TransparentFrame = styled.div<{ isDark: boolean }>`
//   background: ${({ theme }) => (theme.isDark ? 'rgba(8, 6, 11, 0.6)' : ' rgba(255, 255, 255, 0.6)')};
//   padding: 16px;
//   border: 1px solid ${({ theme }) => theme.colors.cardBorder};
//   box-sizing: border-box;
//   backdrop-filter: blur(12px);
//   border-radius: 72px;

//   ${({ theme }) => theme.mediaQueries.md} {
//     padding: 40px;
//   }
// `

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const BottomLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  bottom: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const StyledColoredWordHeading = styled(ColoredWordHeading)`
  color: #fff;
  font-weight: 500;
  font-size: 60px;
  line-height: 63px;
  text-align: center;
  // margin-bottom: 40px;
  margin-bottom: 12px;

  @media screen and (max-width: 1400px) {
    font-size: 50px;
    line-height: 53px;
    // margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    font-size: 35px;
    line-height: 38px;
    // margin-bottom: 15px;
  }
`

const StyledTextWrapper = styled(Text)`
  margin-bottom: 40px;
  text-align: center;

  @media screen and (max-width: 1400px) {
    // margin-bottom: 24px;
  }

  @media screen and (max-width: 576px) {
    // margin-bottom: 24px;
  }
`

const StyledText = styled(Text) <{ $isDarkStyle?: boolean }>`
  color: #000;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  text-align: center;
  margin: 0;
  padding: 0;
  display: inline;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #000;
  `}

  @media screen and (max-width: 1400px) {
    font-size: 23px;
    line-height: 24px;
  }

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
  }
`

const StyledCardListWrapper = styled(Flex)`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`

const StyledCardLayoutWrapper = styled(Flex)`
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    margin: 0;
    align-self: flex-start;
  }

  @media screen and (max-width: 576px) {
    margin: 0 auto;
    align-self: center;
  }
`

const StyledCardWrapper = styled(Flex)`
  position: absolute;
  margin: 0;
  width: 268px;

  &&:nth-child(1) {
    top: 50%;
    left: 50%;
    transform:
      translateX(calc(-50% - (268px / 2) + 12px - 268px - 25px))
      translateY(calc(-50% - 25%));
  }

  &&:nth-child(2) {
    top: 50%;
    left: 50%;
    transform:
      translateX(calc(-50% - (268px / 2) + 12px))
      translateY(calc(-50% + 100px));
  }

  @media screen and (max-width: 1200px) {
    &&,
    &&:nth-child(1),
    &&:nth-child(2) {
      position: relative;
      transform: translate(0, 0);
      top: 0;
      left: 0;
      margin-bottom: 24px;
    }

    &&:nth-child(2) {
      transform: translateX(25%);
    }
  }

  @media screen and (max-width: 576px) {
    && {
      backdrop-filter: blur(5px);
    }

    &&,
    &&:nth-child(1),
    &&:nth-child(2) {
      position: relative;
      transform: translate(0, 0);
      top: 0;
      left: 0;
      margin-bottom: 24px;
    }
  }
`

const StyledIconCard = styled(IconCard)`
  width: 100%;
  border-radius: 10px;
`

const StyledContentWrapper = styled.div`
  margin: 0;
  padding: 0;
`

const PredictionCardData: IconCardData = {
  icon: <PredictionsIcon width="36px" color="inverseContrast" />,
  background: 'linear-gradient(180deg, #ffb237 0%, #ffcd51 51.17%, #ffe76a 100%);',
  borderColor: '#ffb237',
  rotation: '-2.36deg',
}

const LotteryCardData: IconCardData = {
  icon: <TicketFillIcon color="white" width="36px" />,
  background: ' linear-gradient(180deg, #7645D9 0%, #5121B1 100%);',
  borderColor: '#3C1786',
  rotation: '1.43deg',
}

const bottomLeftImage = {
  path: '/images/home/prediction-cards/',
  attributes: [
    { src: 'bottom-left', alt: 'CAKE card' },
    { src: 'green', alt: 'Green CAKE card with up arrow' },
    { src: 'red', alt: 'Red Cake card with down arrow' },
    { src: 'top-right', alt: 'CAKE card' },
  ],
}

const topRightImage = {
  path: '/images/home/lottery-balls/',
  attributes: [
    { src: '2', alt: 'Lottery ball number 2' },
    { src: '4', alt: 'Lottery ball number 4' },
    { src: '6', alt: 'Lottery ball number 6' },
    { src: '7', alt: 'Lottery ball number 7' },
    { src: '9', alt: 'Lottery ball number 9' },
  ],
}

const WinSection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <BottomLeftImgWrapper>
          <CompositeImage {...bottomLeftImage} />
        </BottomLeftImgWrapper>
        <TopRightImgWrapper>
          <CompositeImage {...topRightImage} />
        </TopRightImgWrapper>
      </BgWrapper> */}

      {/* <TransparentFrame isDark={theme.isDark}> */}
      <StyledCardListWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <StyledContentWrapper>
          <StyledColoredWordHeading
            numberOfColoredWords={2}
            firstColorCustomized="#60c5ba"
            textAlign="center"
            text={t('Win millions in prizes.')}
            style={{ color: `${theme.isDark ? '#fff' : '#0b3854'}` }}
          />

          <StyledTextWrapper>
            <StyledText $isDarkStyle={theme.isDark} color="textSubtle">{t('Provably fair, on-chain games.')}</StyledText>
            <StyledText $isDarkStyle={theme.isDark}> </StyledText>
            <StyledText $isDarkStyle={theme.isDark} mb="0px" color="textSubtle">
              {t('Win big with Womentech.')}
            </StyledText>
          </StyledTextWrapper>
        </StyledContentWrapper>

        <StyledCardLayoutWrapper m="0 auto" flexDirection={['column', null, null, 'row']} maxWidth="600px">
          <StyledCardWrapper
            flex="1"
            maxWidth={['268px', null, null, '100%']}
            mr={[null, null, null, '24px']}
            mb={['32px', null, null, '0']}
          >
            <StyledIconCard
              {...PredictionCardData}
              background="linear-gradient(138.81deg, #96E4DC 0%, #FFFFFF 100%)"
              style={{ border: '1px solid #60c5ba' }}
              hasMainIcon={false}
              rotation='0'
            >
              <PredictionCardContent />
            </StyledIconCard>
          </StyledCardWrapper>

          <StyledCardWrapper
            flex="1"
            maxWidth={['268px', null, null, '100%']}
          >
            <StyledIconCard
              {...LotteryCardData}
              background="linear-gradient(138.81deg, #2370B8 0%, #FFFFFF 100%)"
              style={{ border: '1px solid #2370b8' }}
              hasMainIcon={false}
              rotation='0'
            >
              <LotteryCardContent />
            </StyledIconCard>
          </StyledCardWrapper>
        </StyledCardLayoutWrapper>
      </StyledCardListWrapper>
      {/* </TransparentFrame> */}
    </>
  )
}

export default WinSection
