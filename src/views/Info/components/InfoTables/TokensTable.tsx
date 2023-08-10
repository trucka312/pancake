import { useState, useMemo, useCallback, useEffect, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import { TokenData } from 'state/info/types'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow } from './shared'

/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
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

const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
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
`

const StyledClickableColumnHeader = styled(ClickableColumnHeader)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
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

const StyledDataRowPercent = styled(Percent)`
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
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

const TableLoader: React.FC = () => {
  const loadingRow = (
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
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<{ tokenData: TokenData; index: number }> = ({ tokenData, index }) => {
  const { theme } = useTheme()
  const { isXs, isSm } = useMatchBreakpoints()
  return (
    <StyledDataRowLinkWrapper
      to={`/info/token/${tokenData.address}`}
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
        <Flex alignItems="center">
          <ResponsiveLogo address={tokenData.address} />
          {(isXs || isSm) && <Text ml="8px">{tokenData.symbol}</Text>}
          {!isXs && !isSm && (
            <Flex marginLeft="10px">
              <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
                {tokenData.name}
              </StyledDataRowText>
              <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'} ml="8px">
                ({tokenData.symbol})
              </StyledDataRowText>
            </Flex>
          )}
        </Flex>
        <StyledDataRowText fontWeight={400} $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
          ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
        </StyledDataRowText>
        <StyledDataRowText fontWeight={400}>
          <StyledDataRowPercent value={tokenData.priceUSDChange} fontWeight={400} />
        </StyledDataRowText>
        <StyledDataRowText fontWeight={400} $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
          ${formatAmount(tokenData.volumeUSD)}
        </StyledDataRowText>
        <StyledDataRowText fontWeight={400} $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
          ${formatAmount(tokenData.liquidityUSD)}
        </StyledDataRowText>
      </ResponsiveGrid>
    </StyledDataRowLinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

const TokenTable: React.FC<{
  tokenDatas: TokenData[] | undefined
  maxItems?: number
}> = ({ tokenDatas, maxItems = MAX_ITEMS }) => {
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const { t } = useTranslation()
  const { theme } = useTheme()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (tokenDatas) {
      if (tokenDatas.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
    }
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
        .sort((a, b) => {
          if (a && b) {
            return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1
          }
          return -1
        })
        .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, sortDirection, sortField])

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

  if (!tokenDatas) {
    return <Skeleton />
  }

  return (
    <StyledTableWrapper>
      <StyledTableHeader $bgColor={theme.colors.bgDarkWeaker}>
        <StyledTableHeaderText color="itemPrimary" fontSize="12px" bold>
          #
        </StyledTableHeaderText>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.name)}
          textTransform="uppercase"
        >
          {t('Name')} {arrow(SORT_FIELD.name)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.priceUSD)}
          textTransform="uppercase"
        >
          {t('Price')} {arrow(SORT_FIELD.priceUSD)}
        </StyledClickableColumnHeader>
        <StyledClickableColumnHeader
          color="itemPrimary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
          textTransform="uppercase"
        >
          {t('Price Change')} {arrow(SORT_FIELD.priceUSDChange)}
        </StyledClickableColumnHeader>
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
          onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
          textTransform="uppercase"
        >
          {t('Liquidity')} {arrow(SORT_FIELD.liquidityUSD)}
        </StyledClickableColumnHeader>
      </StyledTableHeader>

      {/* <Break /> */}
      {sortedTokens.length > 0 ? (
        <>
          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <Fragment key={data.address}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} />
                  {/* <Break /> */}
                </Fragment>
              )
            }
            return null
          })}
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
          <Box />
        </>
      )}
    </StyledTableWrapper>
  )
}

export default TokenTable
