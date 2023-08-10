import { useMemo } from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, CardBody, CardFooter, AddIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ActiveLink from 'views/Swap/components/ActiveLink'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import { BasicButton, FindButton } from '../../../packages/uikit/src/components/Button/index.stories'

const Body = styled(CardBody) <{ $isDark: boolean }>`
  padding: 1rem;
  background-color: ${({ $isDark }) => ($isDark ? '#1E2735' : ' #fff')};
`

const Footer = styled.div<{ $isDark: boolean }>`
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#1E2735' : ' #fff')};
  }
`

const Content = styled.div<{ $isDark: boolean }>`
  padding: 20px 0 32px;
  border-radius: 7px;
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#101722' : ' #fff')};
  }
  border: 1px solid #0b3854;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const router = useRouter()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {/* {t('No liquidity found.')} */}
      </Text>
    )
  }

  return (
    <Page>
      <ActiveLink route={router.route} />
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body $isDark={isDark}>
          {renderBody()}
          {account && !v2IsLoading && (
            <Content $isDark={isDark}>
              <Flex flexDirection="column" alignItems="center" mt="24px">
                <Text color={isDark ? 'textSubtle' : '#60C5BA'} mb="8px">
                  {t("Don't see a pool you joined?")}
                </Text>
                <Link href="/find" passHref>
                  {/* <Button
                    id="import-pool-link"
                    style={{ border: '2px solid #60C5BA', background: 'transparent', color: '#60C5BA' }}
                    scale="sm"
                    as="a"
                  >
                    {t('Find other LP tokens')}
                  </Button> */}
                  <BasicButton id="import-pool-link" variant="customFind" scale='sm'>{t('Find other LP tokens')}</BasicButton>
                </Link>
              </Flex>
            </Content>
          )}
        </Body>
        <Footer $isDark={isDark}>
          <CardFooter style={{ textAlign: 'center' }}>
            <Link href="/add" passHref>
              <BasicButton
                variant="primary"
                style={{ textShadow: isDark ? 'none' : 'none' }}
                id="join-pool-button"
                width="100%"
                startIcon={<AddIcon color="inherit" />}
              >
                {/* <Button
                style={{ background: isDark ? '#60C5BA80' : '#60C5BA80', border: '1px solid #60C5BA', color:'#60C5BA', padding: '30px 0' }}
                id="join-pool-button"
                width="100%"
                startIcon={<AddIcon color="#60C5BA" />}
              > */}
                {t('Add Liquidity')}
              </BasicButton>
            </Link>
          </CardFooter>
        </Footer>
      </AppBody>
    </Page>
  )
}
