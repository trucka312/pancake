import { Heading, Flex, Text, Skeleton, ChartIcon, CommunityIcon, SwapIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import styled, { css } from 'styled-components'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
// import GradientLogo from '../GradientLogoSvg'

const StyledHeadingsWrapper = styled.div`
  && {
    text-align: center;
    // margin-bottom: 40px;
    margin-bottom: 12px;
  }

  @media screen and (max-width: 1400px) {
    && {
      // margin-bottom: 20px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      // margin-bottom: 15px;
    }
  }
`

const StyledTextsWrapper = styled.div <{ $isDarkStyle?: boolean }>`
  && {
    margin-bottom: 168px;
  }

  && div {
    margin: 0;
  }

  &&,
  && div {
    color: #000;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 100%;
    text-align: center;

    ${(props) => props.$isDarkStyle ? css`
      color: #fff;
    ` : css`
      color: #000;
    `}
  }

  @media screen and (max-width: 992px) {
    && {
      margin-bottom: 96px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      margin-bottom: 24px;
    }
  }
`

const StyledIconCardWrapper = styled.div`
  && {
    position: relative;
    display: inline-block;
    margin: 20px 40px;
  }
`

const StyledBubbleWrapper = styled.div`
  && {
    position: absolute;
    width: 35%;
    height: 35%;
    border-radius: 50%;
    background: transparent;
    top: 0;
    left: 0;
    z-index: 1;
    animation: bubbling calc(1s * var(--num)) ease 0s infinite alternate;
  }

  @keyframes bubbling {
    from {
      top: 0;
    }
    to {
      top: 30px;
    }
  }
`

const StyledBubble = styled.div`
  && {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: -5px -5px 10px 0px #ffffff54 inset;

    &&::after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      border-radius: 50%;
      bottom: -100%;
      right: -100%;
      box-shadow: 0px 0px 80px 50px #fff;
    }
  }
`

const StyledIconCard = styled(IconCard) <{ $isCircle?: boolean }>`
  && {
    width: 258px;
    height: 258px;
    background: #60c5ba;
    background: linear-gradient(
      -60deg,
      #60c5ba 0%,
      rgba(96, 197, 186, 0.5) 20%,
      rgba(96, 197, 186, 0) 60%,
      rgba(96, 197, 186, 0) 100%
    );
    box-shadow: 20px 20px 30px -15px #60c5ba;
    margin: 0;
    overflow: visible;

    ${(props) =>
    props.$isCircle &&
    css`
        border-radius: 50%;
      `}
  }

  && > div {
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &&::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 100%;
    left: 100%;
    box-shadow: -250px -250px 50px 0px rgba(96, 197, 186, 0.25);
    border-radius: 50%;
  }
`

const StyledHeading = styled(Heading) <{ $isHighlighted?: boolean, $isDarkStyle?: boolean }>`
  && {
    color: #000;
    font-weight: 500;
    font-size: 64px;
    line-height: 100%;
    text-align: center;
    margin: 0;
    display: inline;

    ${(props) => props.$isDarkStyle ? css`
      color: #fff;
    ` : css`
      color: #0b3854;
    `}

    ${(props) => props.$isHighlighted && css`
      color: #60c5ba;
    `}
  }

  @media screen and (max-width: 1400px) {
    && {
      font-size: 50px;
      line-height: 53px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      font-size: 35px;
      line-height: 38px;
    }
  }
`

const StyledIconCardList = styled(Flex)`
  && {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 1400px) {
    && > div {
      margin: 0 24px 40px 24px;
    }
  }

  @media screen and (max-width: 992px) {
    && > div {
      margin: 0 24px 40px 24px;
    }
  }

  @media screen and (max-width: 576px) {
    && > div {
      margin: 0px 0px 24px 0px;
    }
  }
`

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <StyledHeadingsWrapper>
        <StyledHeading $isDarkStyle={theme.isDark} textAlign="center" scale="xl">
          {t('Used by millions.')}
        </StyledHeading>
        <span> </span>
        <StyledHeading $isDarkStyle={theme.isDark} $isHighlighted textAlign="center" scale="xl" mb="32px">
          {t('Trusted with billions.')}
        </StyledHeading>
      </StyledHeadingsWrapper>

      <StyledTextsWrapper $isDarkStyle={theme.isDark}>
        <Text textAlign="center" color="textSubtle">
          {t('Womentech has the most users of any decentralized platform, ever.')}
        </Text>
        <Flex flexWrap="wrap">
          <Text textAlign="center" color="textSubtle" display="inline" mb="20px">
            {entrusting}
            <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
            {inFunds}
          </Text>
        </Flex>
      </StyledTextsWrapper>

      <StyledIconCardList flexDirection={['column', null, null, 'row']}>
        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
            <StatCardContent
              headingText={t('%users% users', { users })}
              bodyText={t('In the last 30 days')}
              highlightColor={theme.colors.secondary}
              lastWordColor="#5398c6"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ ['--num' as any]: '2', top: '-5%', left: '10%' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>

        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
            <StatCardContent
              headingText={t('%trades% trades', { trades })}
              bodyText={t('In the last 30 days')}
              highlightColor={theme.colors.primary}
              lastWordColor="#5398c6"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ ['--num' as any]: '2', top: '-10%', right: '10%', left: 'auto' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>

        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...StakedCardData}>
            <StatCardContent
              headingText={t('$%tvl% staked', { tvl: tvlString })}
              bodyText={t('Total Value Locked')}
              highlightColor={theme.colors.failure}
              lastWordColor="#5398c6"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ ['--num' as any]: '2', top: '-5%', left: '10%', transform: 'rotate(90deg)' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>
      </StyledIconCardList>
    </Flex>
  )
}

export default Stats
