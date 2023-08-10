import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import { BasicButton } from '../../../../../packages/uikit/src/components/Button/index.stories'

const StyledWrapper = styled.div`
  padding: 30px;
`

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`
const StyledCardHeading = styled(Text)`
  color: #0B3854;
  font-size: 24px;
  line-height: 25px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
`

const StyledCardTitle = styled(Text)`
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
`

const StyledCardTitleUnder = styled(Text)`
  color: #0B3854;
  font-weight: 400;
  font-size: 16px;
  line-height: 17px;
  margin: 0;
  padding: 0;
`

const StyledCardTitleMain = styled(Heading)`
  color: #0B3854;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 43px;
  margin: 0;
  padding: 0;
`

const StyledCardContent = styled(Text)`
  color: #0B3854;
  font-weight: 400;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 20px;
`

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = useBNBBusdPrice()
  const { data: bnbWon = 0 } = useSWR(loadData ? ['prediction', 'bnbWon'] : null, getTotalWon, {
    refreshInterval: SLOW_INTERVAL,
  })
  const bnbWonInUsd = multiplyPriceByAmount(bnbBusdPrice, bnbWon)

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd)
  const bnbWonText = t('$%bnbWonInUsd% in BNB won so far', { bnbWonInUsd: localisedBnbUsdString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnbUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <StyledWrapper>
      <Flex flexDirection="column" mt="0px">
        <StyledCardHeading color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </StyledCardHeading>

        <StyledCardTitle>
          {bnbWonInUsd ? (
            <StyledCardTitleMain color="#fff" my="8px" scale="xl" bold style={{ textAlign: 'center' }}>
              {pretext}
              {localisedBnbUsdString}
            </StyledCardTitleMain>
          ) : (
            <>
              <Skeleton width={230} height={40} my="8px" />
              <div ref={observerRef} />
            </>
          )}
          <StyledCardTitleUnder color="#fff" mb="24px" bold fontSize="16px">
            {wonSoFar}
          </StyledCardTitleUnder>
        </StyledCardTitle>

        <StyledCardContent color="#280D5F" mb="40px">
          {t('Will BNB price rise or fall? guess correctly to win!')}
        </StyledCardContent>
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/prediction" id="homepage-prediction-cta">
          <BasicButton variant='customPrimary' width="100%">
            <Text bold color="inherit">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="inherit" />
          </BasicButton>
        </StyledLink>
      </Flex>
    </StyledWrapper>
  )
}

export default PredictionCardContent
