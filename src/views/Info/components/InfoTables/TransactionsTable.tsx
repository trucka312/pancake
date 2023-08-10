// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { useCallback, useState, useMemo, useEffect, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { formatDistanceToNowStrict } from 'date-fns'
import {
  Text,
  Flex,
  Box,
  Radio,
  Skeleton,
  LinkExternal,
  ArrowForwardIcon,
  ArrowBackIcon,
  Heading,
} from '@pancakeswap/uikit'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { Transaction, TransactionType } from 'state/info/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow } from './shared'

const Wrapper = styled.div`
  width: 100%;
`

const ResponsiveGrid = styled.span`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 2fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 2fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 0px;
  cursor: pointer;
`

const StyledRadio = styled(Radio) <{ $color?: string, $borderColor?: string }>`
  color: ${(props) => props.$color || ''};
  border: 1.5px solid ${(props) => props.$borderColor || ''};
  width: 20px;
  height: 20px;
  margin: 0 12px 0 0;
  position: relative;

  &&:checked {
    background: ${(props) => props.$color || ''};
    border: none;
  }

  &&:checked::after {
    background: ${(props) => props.$color || ''};
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &&:focus,
  &&:hover:not(:disabled):not(:checked) {
    box-shadow:
      0px 0px 0px 1px ${(props) => props.$color || ''},
      0px 0px 0px 4px ${(props) => `${props.$color}99` || ''};
  }
`

const StyledRadioGroupText = styled(Text) <{ $isDarkStyle?: boolean }>`
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;
  margin: 0;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #000;
  `}
`

const StyledTableHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 30px 0;
  flex-wrap: wrap;

  @media screen and (max-width: 576px) {
    justify-content: flex-start;
    gap: 8px;
  }
`

const StyledHeading = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  margin: 0 0 0px 0;
`

const StyledTableWrapper = styled(TableWrapper)`
  background: transparent;
  border: none;
  border-radius: 0px;
  padding: 0px;
  gap: 0px;
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

const StyledDataRowLinkExternal = styled(LinkExternal) <{ $txtColor?: string, $iconColor?: string }>`
  color: ${(props) => props.$txtColor || ''};

  && svg {
    fill: ${(props) => props.$iconColor || ''};
  }
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

const StyledDataRowWrapper = styled(ResponsiveGrid) <{ $bgColor?: string, $borderColor?: string }>`
  && {
    padding: 20px 30px;
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

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

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

const DataRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol

  return (
    <StyledDataRowWrapper
      $bgColor={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
      $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#EBEBEB'}
    >
      <StyledDataRowLinkExternal
        href={getBscScanLink(transaction.hash, 'transaction')}
        $txtColor={theme.colors.itemPrimary}
        $iconColor={theme.isDark ? '#fff' : '#6E6E6E'}
      >
        <StyledDataRowText $txtColor={theme.colors.itemPrimary}>
          {transaction.type === TransactionType.MINT
            ? t('Add %token0% and %token1%', { token0: transaction.token0Symbol, token1: transaction.token1Symbol })
            : transaction.type === TransactionType.SWAP
              ? t('Swap %token0% for %token1%', { token0: inputTokenSymbol, token1: outputTokenSymbol })
              : t('Remove %token0% and %token1%', { token0: transaction.token0Symbol, token1: transaction.token1Symbol })}
        </StyledDataRowText>
      </StyledDataRowLinkExternal>
      <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
        ${formatAmount(transaction.amountUSD)}
      </StyledDataRowText>
      <Text>
        <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
          {`${formatAmount(abs0)} ${transaction.token0Symbol}`}
        </StyledDataRowText>
      </Text>
      <Text>
        <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
          {`${formatAmount(abs1)} ${transaction.token1Symbol}`}
        </StyledDataRowText>
      </Text>
      <StyledDataRowLinkExternal
        href={getBscScanLink(transaction.sender, 'address')}
        $txtColor={theme.colors.itemPrimary}
        $iconColor={theme.isDark ? '#fff' : '#6E6E6E'}
      >
        {truncateHash(transaction.sender)}
      </StyledDataRowLinkExternal>
      <StyledDataRowText $txtColor={theme.isDark ? '#fff' : '#6E6E6E'}>
        {formatDistanceToNowStrict(parseInt(transaction.timestamp, 10) * 1000)}
      </StyledDataRowText>
    </StyledDataRowWrapper>
  )
}

const TransactionTable: React.FC<{
  transactions: Transaction[]
  headingContent?: string
}> = ({ transactions, headingContent }) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const { t } = useTranslation()
  const { theme } = useTheme()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  const sortedTransactions = useMemo(() => {
    const toBeAbsList = [SORT_FIELD.amountToken0, SORT_FIELD.amountToken1]
    return transactions
      ? transactions
        .slice()
        .sort((a, b) => {
          if (a && b) {
            const firstField = a[sortField as keyof Transaction]
            const secondField = b[sortField as keyof Transaction]
            const [first, second] = toBeAbsList.includes(sortField)
              ? [Math.abs(firstField as number), Math.abs(secondField as number)]
              : [firstField, secondField]
            return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return -1
        })
        .filter((x) => {
          return txFilter === undefined || x.type === txFilter
        })
        .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [transactions, page, sortField, sortDirection, txFilter])

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      const filteredTransactions = transactions.filter((tx) => {
        return txFilter === undefined || tx.type === txFilter
      })
      if (filteredTransactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE))
      } else {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1)
      }
    }
  }, [transactions, txFilter])

  const handleFilter = useCallback(
    (newFilter: TransactionType) => {
      if (newFilter !== txFilter) {
        setTxFilter(newFilter)
        setPage(1)
      }
    },
    [txFilter],
  )

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
    <Wrapper>
      {/* Section 1: */}
      <StyledTableHeading>
        <StyledHeading color="itemPrimary" scale="lg" mt="40px" mb="16px">
          {headingContent}
        </StyledHeading>

        <Flex mb="0px">
          <Flex flexDirection={['column', 'row']} flexWrap='wrap'>
            <RadioGroup onClick={() => handleFilter(undefined)}>
              <StyledRadio
                $color={theme.colors.itemPrimary}
                $borderColor={theme.colors.itemBlueUnhighlight}
                onChange={() => null}
                scale="sm"
                checked={txFilter === undefined}
              />
              <StyledRadioGroupText $isDarkStyle={theme.isDark} ml="8px">{t('All')}</StyledRadioGroupText>
            </RadioGroup>

            <RadioGroup onClick={() => handleFilter(TransactionType.SWAP)}>
              <StyledRadio
                $color={theme.colors.itemPrimary}
                $borderColor={theme.colors.itemBlueUnhighlight}
                onChange={() => null}
                scale="sm"
                checked={txFilter === TransactionType.SWAP}
              />
              <StyledRadioGroupText $isDarkStyle={theme.isDark} ml="8px">{t('Swaps')}</StyledRadioGroupText>
            </RadioGroup>
          </Flex>

          <Flex flexDirection={['column', 'row']} flexWrap='wrap'>
            <RadioGroup onClick={() => handleFilter(TransactionType.MINT)}>
              <StyledRadio
                $color={theme.colors.itemPrimary}
                $borderColor={theme.colors.itemBlueUnhighlight}
                onChange={() => null}
                scale="sm"
                checked={txFilter === TransactionType.MINT}
              />
              <StyledRadioGroupText $isDarkStyle={theme.isDark} ml="8px">{t('Adds')}</StyledRadioGroupText>
            </RadioGroup>

            <RadioGroup onClick={() => handleFilter(TransactionType.BURN)}>
              <StyledRadio
                $color={theme.colors.itemPrimary}
                $borderColor={theme.colors.itemBlueUnhighlight}
                onChange={() => null}
                scale="sm"
                checked={txFilter === TransactionType.BURN}
              />
              <StyledRadioGroupText $isDarkStyle={theme.isDark} ml="8px">{t('Removes')}</StyledRadioGroupText>
            </RadioGroup>
          </Flex>
        </Flex>
      </StyledTableHeading>

      {/* Section 2: */}
      <StyledTableWrapper>
        <StyledTableHeader $bgColor={theme.colors.bgDarkWeaker}>
          <StyledTableHeaderText color="itemPrimary" fontSize="12px" bold textTransform="uppercase">
            {t('Action')}
          </StyledTableHeaderText>
          <StyledClickableColumnHeader
            color="itemPrimary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountUSD)}
            textTransform="uppercase"
          >
            {t('Total Value')} {arrow(SORT_FIELD.amountUSD)}
          </StyledClickableColumnHeader>
          <StyledClickableColumnHeader
            color="itemPrimary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken0)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken0)}
          </StyledClickableColumnHeader>
          <StyledClickableColumnHeader
            color="itemPrimary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken1)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken1)}
          </StyledClickableColumnHeader>
          <StyledClickableColumnHeader
            color="itemPrimary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.sender)}
            textTransform="uppercase"
          >
            {t('Account')} {arrow(SORT_FIELD.sender)}
          </StyledClickableColumnHeader>
          <StyledClickableColumnHeader
            color="itemPrimary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.timestamp)}
            textTransform="uppercase"
          >
            {t('Time')} {arrow(SORT_FIELD.timestamp)}
          </StyledClickableColumnHeader>
        </StyledTableHeader>
        {/* <Break /> */}

        {transactions ? (
          <>
            {sortedTransactions.map((transaction, index) => {
              if (transaction) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={index}>
                    <DataRow transaction={transaction} />
                    {/* <Break /> */}
                  </Fragment>
                )
              }
              return null
            })}
            {sortedTransactions.length === 0 ? (
              <Flex justifyContent="center">
                <Text>{t('No Transactions')}</Text>
              </Flex>
            ) : undefined}
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
    </Wrapper>
  )
}

export default TransactionTable
