import { useState, useEffect } from 'react'
import { Flex, Text, Skeleton, ArrowForwardIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePriceCakeBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { fetchCurrentLotteryIdAndMaxBuy, fetchLottery } from 'state/lottery/helpers'
import { getBalanceAmount } from 'utils/formatBalance'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { BasicButton } from '../../../../../packages/uikit/src/components/Button/index.stories'

const StyledWrapper = styled.div`
  padding: 30px;
`

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  // background: ${({ theme }) => theme.colors.gradients.gold};
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #fff;
  font-weight: 600;
  font-size: 32px;
  line-height: 33px;
  margin: 0;
  padding: 0;
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
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 17px;
  margin: 0;
  padding: 0;
`

const StyledCardContent = styled(Text)`
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 20px;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const cakePriceBusd = usePriceCakeBusd()
  const { data: lotteryId = null } = useSWRImmutable(loadData ? ['lottery', 'currentLotteryId'] : null, async () => {
    const { currentLotteryId } = await fetchCurrentLotteryIdAndMaxBuy()
    if (currentLotteryId) {
      return currentLotteryId
    }
    throw new Error('Error fetching current lottery id')
  })
  const { data: currentLotteryPrizeInCake = null } = useSWR(
    lotteryId ? ['lottery', 'currentLotteryPrize'] : null,
    async () => {
      const { amountCollectedInCake } = await fetchLottery(lotteryId)
      if (amountCollectedInCake) {
        return parseFloat(amountCollectedInCake)
      }
      throw new Error('Error fetching current lottery prize')
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const cakePrizesText = t('%cakePrizeInUsd% in CAKE prizes this round', { cakePrizeInUsd: cakePriceBusd.toString() })
  const [pretext, prizesThisRound] = cakePrizesText.split(cakePriceBusd.toString())

  const currentLotteryPrize = currentLotteryPrizeInCake ? cakePriceBusd.times(currentLotteryPrizeInCake) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <StyledWrapper>
      <Flex flexDirection="column" mt="0px">
        <StyledCardHeading color="white" bold fontSize="16px">
          {t('Lottery')}
        </StyledCardHeading>

        {pretext && (
          <Text color="white" mt="12px" bold fontSize="16px">
            {pretext}
          </Text>
        )}

        <StyledCardTitle>
          {currentLotteryPrize && currentLotteryPrize.gt(0) ? (
            <StyledBalance
              fontSize="40px"
              bold
              prefix="$"
              decimals={0}
              value={getBalanceAmount(currentLotteryPrize).toNumber()}
            />
          ) : (
            <>
              <Skeleton width={200} height={40} my="8px" />
              <div ref={observerRef} />
            </>
          )}
          <StyledCardTitleUnder color="white" mb="24px" bold fontSize="16px">
            {prizesThisRound}
          </StyledCardTitleUnder>
        </StyledCardTitle>

        <StyledCardContent color="white" mb="40px">
          {t('Buy tickets with OnDefi, win OnDefi if your numbers match')}
        </StyledCardContent>
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/lottery" id="homepage-prediction-cta">
          <BasicButton variant='customPrimary' width="100%" style={{ backgroundColor: '#2370B8' }}>
            <Text bold color="inherit">
              {t('Buy Tickets')}
            </Text>
            <ArrowForwardIcon ml="4px" color="inherit" />
          </BasicButton>
        </StyledLink>
      </Flex>
    </StyledWrapper>
  )
}

export default LotteryCardContent
