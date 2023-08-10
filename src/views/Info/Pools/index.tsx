import { useMemo } from 'react'
import { Heading, Card } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'

const StyledSection = styled.div`
  margin-bottom: 60px;

  &&:last-child {
    margin-bottom: 0;
  }
`

const StyledHeading = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  margin: 0 0 30px 0;
`

const StyledCardForNoSavedPools = styled(Card) <{
  $txtColor?: string,
  $bgColor?: string,
  $borderColor?: string
}>`
  background: ${(props) => props.$bgColor};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.$borderColor};
  backdrop-filter: blur(5px);
  // Content:
  color: ${(props) => props.$txtColor};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;

  && > div {
    background: transparent;
  }
`

const PoolsOverview: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <Page>
      {/* Section 1: */}
      <StyledSection>
        <StyledHeading color={theme.colors.itemPrimary} scale="lg" mb="16px">
          {t('Your Watchlist')}
        </StyledHeading>
        <StyledCardForNoSavedPools
          $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}
          $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
          $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
        >
          {watchlistPools.length > 0 ? (
            <PoolTable poolDatas={watchlistPools} />
          ) : (
            // <Text px="24px" py="16px">
            //   {t('Saved pools will appear here')}
            // </Text>
            <>{t('Saved pools will appear here')}</>
          )}
        </StyledCardForNoSavedPools>
      </StyledSection>

      {/* Section 2: */}
      <StyledSection>
        <StyledHeading color={theme.colors.itemPrimary} scale="lg" mb="16px">
          {t('All Pools')}
        </StyledHeading>
        <PoolTable poolDatas={poolDatas} />
      </StyledSection>
    </Page>
  )
}

export default PoolsOverview
