import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Box, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import useGetTopPoolsByApr from 'views/Home/hooks/useGetTopPoolsByApr'
import { vaultPoolConfig } from 'config/constants/pools'
import useTheme from 'hooks/useTheme'
import TopFarmPool from './TopFarmPool'
import RowHeading from './RowHeading'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(5, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
  }
`

const StyledTopFarmPoolList = styled(Grid)`
  display: flex;
  grid-gap: 40px;

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    grid-gap: 24px;

    &&:nth-child(2) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }

  @media screen and (max-width: 576px) {
    justify-content: flex-start;
    grid-gap: 16px 16px;
  }
`

const StyledTopFarmPool = styled.div`
  flex: 1 1 0%;

  @media screen and (max-width: 992px) {
    margin-bottom: 163px;
    min-width: 208px;
    max-width: 208px;
  }

  @media screen and (max-width: 576px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    margin-bottom: 125px;

    && > div > div {
      min-height: 125px;
      backdrop-filter: blur(5px);
    }
  }
`

const StyledRowHeading = styled(RowHeading)`
  font-family: 'Josefin Sans', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 31px;
  text-align: center;
  margin: 0px 20px 0 0;

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
  }
`

const StyledBoxForTopFarmPool = styled(Box)`
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 163px;
  transition: all 0.5s ease;
  transform: translateX(0);

  @media screen and (min-width: 768px) {
    transform: translateX(0) !important;
  }
`

// const StyledControlsWrapper = styled.div`
//   display: none;
//   flex-direction: row;
//   justify-content: center;
//   align-item: center;
//   height: auto;
//   margin-top: 24px;

//   @media screen and (max-width: 768px) {
//     display: flex;
//   }
// `

// const StyledControl = styled.div<{ $isDisabled?: boolean }>`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 30px;
//   height: 30px;
//   background: #fff;
//   border-radius: 50%;
//   margin-right: 24px;
//   color: #ff0099;
//   box-shadow: 0px 0px 0px 5px #eee;

//   &&:last-child {
//     margin-right: 0;
//   }

//   &:hover {
//     opacity: 0.5;
//   }

//   ${(props) =>
//     props.$isDisabled &&
//     css`
//       cursor: default;
//       opacity: 0.5;
//       pointer-events: none;
//     `}
// `

const FarmsPoolsRow = () => {
  const { theme } = useTheme()

  // const [scrollValue, setScrollValue] = useState('0')
  const slidesRef = useRef(null)

  const [showFarms, setShowFarms] = useState(false)
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { topFarms } = useGetTopFarmsByApr(isIntersecting)
  const { topPools } = useGetTopPoolsByApr(isIntersecting)

  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const isLoaded = topFarms[0] && topPools[0]

  const startTimer = useCallback(() => {
    timer.current = setInterval(() => {
      setShowFarms((prev) => !prev)
    }, 6000)
  }, [timer])

  useEffect(() => {
    if (isLoaded) {
      startTimer()
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [timer, isLoaded, startTimer])

  const getPoolText = (pool: DeserializedPool) => {
    if (pool.vaultKey) {
      return vaultPoolConfig[pool.vaultKey].name
    }

    if (pool.sousId === 0) {
      return t('Manual CAKE')
    }

    return t('Stake %stakingSymbol% - Earn %earningSymbol%', {
      earningSymbol: pool.earningToken.symbol,
      stakingSymbol: pool.stakingToken.symbol,
    })
  }

  // const handleChangeScrollValue = (type) => {
  //   if (type === 'next') {
  //     setScrollValue(`${slidesRef.current.offsetWidth - slidesRef.current.scrollWidth}px`)
  //   } else if (type === 'prev') {
  //     setScrollValue('0')
  //   }
  // }

  return (
    <div ref={observerRef}>
      <Flex flexDirection="column" mt="40px">
        <Flex mb="24px" alignItems="center">
          <StyledRowHeading
            text={showFarms ? t('Top Farms') : t('Top Syrup Pools')}
            color={theme.isDark ? '#fff' : '#0b3854'}
            highlightedColor="#60c5ba"
            unhighlightedWords={1}
          />
          <IconButton
            variant="text"
            height="100%"
            width="auto"
            onClick={() => {
              setShowFarms((prev) => !prev)
              clearInterval(timer.current)
              startTimer()
            }}
            style={{ backgroundColor: '#fff' }}
          >
            <SwapVertIcon height="24px" width="24px" color="textSubtle" style={{ fill: '#60c5ba' }} />
          </IconButton>
        </Flex>

        <StyledBoxForTopFarmPool
          height={['240px', null, '80px']}
          // style={{ transform: `translateX(${scrollValue})` }}
          ref={slidesRef}
        >
          <StyledTopFarmPoolList>
            {topFarms.map((topFarm, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <StyledTopFarmPool key={index}>
                <TopFarmPool
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  title={topFarm?.lpSymbol}
                  percentage={topFarm?.apr + topFarm?.lpRewardsApr}
                  index={index}
                  visible={showFarms}
                />
              </StyledTopFarmPool>
            ))}
          </StyledTopFarmPoolList>
          <StyledTopFarmPoolList>
            {topPools.map((topPool, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <StyledTopFarmPool key={index}>
                <TopFarmPool
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  title={topPool && getPoolText(topPool)}
                  percentage={topPool?.apr}
                  index={index}
                  visible={!showFarms}
                />
              </StyledTopFarmPool>
            ))}
          </StyledTopFarmPoolList>
        </StyledBoxForTopFarmPool>
      </Flex>

      {/* <StyledControlsWrapper>
        <StyledControl
          role="button"
          tabIndex={0}
          onClick={() => handleChangeScrollValue('prev')}
          onKeyDown={() => handleChangeScrollValue('prev')}
          $isDisabled={scrollValue === '0'}
        >
          {'<'}
        </StyledControl>
        <StyledControl
          role="button"
          tabIndex={0}
          onClick={() => handleChangeScrollValue('next')}
          onKeyDown={() => handleChangeScrollValue('next')}
          $isDisabled={scrollValue !== '0'}
        >
          {'>'}
        </StyledControl>
      </StyledControlsWrapper> */}
    </div>
  )
}

export default FarmsPoolsRow
