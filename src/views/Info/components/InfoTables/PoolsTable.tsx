import { useCallback, useState, useMemo, useEffect, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Text, Flex, Box, Skeleton, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import { formatAmount } from 'utils/formatInfoNumbers'
import { PoolData } from 'state/info/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow } from './shared'

/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool |     | Volume 24H | Volume 7D |
 *  3 = | # | Pool |     | Volume 24H |           |
 *  2 = |   | Pool |     | Volume 24H |           |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const StyledTableHeader = styled(ResponsiveGrid) <{ $bgColor?: string }>`
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 24px;
  background: ${(props) => props.$bgColor || ''};
`

const StyledTableHeaderText = styled(Text)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  height: 100%;
`

const StyledClickableColumnHeader = styled(ClickableColumnHeader)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  height: 100%;
`

const StyledDataRowText = styled(Text) <{ $isNumber?: boolean, $txtColor?: string, $numBgColor?: string }>`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  text-transform: capitalize;
  color: ${(props) => props.$txtColor || ''};

  ${(props) =>
    props.$isNumber &&
    css`
      padding: 5px 8px;
      background: ${props.$numBgColor || ''};
      border-radius: 5px;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 16px;
    `}
`

const StyledDataRowLinkWrapper = styled(LinkWrapper) <{ $bgColor?: string, $borderColor?: string }>`
  && {
    padding: 20px 0;
    border-radius: 0;
    background: ${(props) => props.$bgColor || ''};
    border-bottom: ${(props) => `1px solid ${props.$borderColor}` || '1px solid transparent'};
  }

  &&:first-of-type {
    border-radius: 10px 10px 0 0;
  }

  &&:last-of-type {
    border-radius: 0 0 10px 10px;
    border-bottom: none;
  }
`

const StyledTableWrapper = styled(TableWrapper)`
  background: transparent;
  border: none;
  border-radius: 0px;
  padding: 0px;
  gap: 0px;
`

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC = () => (
  <ResponsiveGrid>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
    <div style={{ margin: '10px' }}>
      <Skeleton />
    </div>
  </ResponsiveGrid>
)

const TableLoader: React.FC = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  const { theme } = useTheme()
  return (
    <StyledDataRowLinkWrapper
      to={`/info/pool/${poolData.address}`}
      $bgColor={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
      $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#EBEBEB'}
    >
      <ResponsiveGrid>
        <Flex>
          <StyledDataRowText
            $isNumber
            $numBgColor={theme.isDark ? theme.colors.bgDark : theme.colors.bgBright}
          >{index + 1}</StyledDataRowText>
        </Flex>
        <Flex>
          <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
          <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'} ml="8px">
            {poolData.token0.symbol}/{poolData.token1.symbol}
          </StyledDataRowText>
        </Flex>
        <StyledDataRowText $txtColor={theme.colors.itemPrimary}>${formatAmount(poolData.volumeUSD)}</StyledDataRowText>
        <StyledDataRowText $txtColor={theme.colors.itemPrimary}>${formatAmount(poolData.volumeUSDWeek)}</StyledDataRowText>
        <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>${formatAmount(poolData.lpFees24h)}</StyledDataRowText>
        <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>{formatAmount(poolData.lpApr7d)}%</StyledDataRowText>
        <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>${formatAmount(poolData.liquidityUSD)}</StyledDataRowText>
      </ResponsiveGrid>
    </StyledDataRowLinkWrapper>
  )
}

interface PoolTableProps {
  poolDatas: PoolData[]
  loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PoolTable: React.FC<PoolTableProps> = ({ poolDatas, loading }) => {
  const { theme } = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const { t } = useTranslation()

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
  }, [poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
        .sort((a, b) => {
          if (a && b) {
            return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1
          }
          return -1
        })
        .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
    <StyledTableWrapper>
      <StyledTableHeader $bgColor={theme.colors.bgDarkWeaker}>
        <StyledTableHeaderText color="itemPrimary" fontSize="12px" bold>
          #
        </StyledTableHeaderText>
        <StyledTableHeaderText color="itemPrimary" fontSize="12px" bold textTransform="uppercase">
          {t('Pool')}
        </StyledTableHeaderText>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          {t('Volume 24H')} {arrow(SORT_FIELD.volumeUSD)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          {t('Volume 7D')} {arrow(SORT_FIELD.volumeUSDWeek)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.lpFees24h)}
          textTransform="uppercase"
        >
          {t('LP reward fees 24H')} {arrow(SORT_FIELD.lpFees24h)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.lpApr7d)}
          textTransform="uppercase"
        >
          {t('LP reward APR')} {arrow(SORT_FIELD.lpApr7d)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
          textTransform="uppercase"
        >
          {t('Liquidity')} {arrow(SORT_FIELD.liquidityUSD)}
        </StyledClickableColumnHeader>
      </StyledTableHeader>

      {/* <Break /> */}
      {sortedPools.length > 0 ? (
        <>
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <Fragment key={poolData.address}>
                  <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} poolData={poolData} />
                  {/* <Break /> */}
                </Fragment>
              )
            }
            return null
          })}
          {loading && <LoadingRow />}
          <PageButtons style={{ margin: '24px 0 0 0' }}>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text style={{ color: `${theme.isDark ? '#fff' : '#6E6E6E'}` }}>
              {t('Page %page% of %maxPage%', { page, maxPage })}
            </Text>

            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      ) : (
        <>
          <TableLoader />
          {/* spacer */}
          <Box />
        </>
      )}
    </StyledTableWrapper>
  )
}

export default PoolTable
