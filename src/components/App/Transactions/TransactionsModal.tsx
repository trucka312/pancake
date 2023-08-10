import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Modal, ModalBody, Text, Button, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import orderBy from 'lodash/orderBy'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { AppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { AutoRow } from '../../Layout/Row'
import Transaction from './Transaction'
import ConnectWalletButton from '../../ConnectWalletButton'

const ParentModal = styled.div`
  position: relative;
  z-index: 100;
  #modallast h2 {
    color: #60c5ba;
  }
`

function renderTransactions(transactions: TransactionDetails[]) {
  return (
    <Flex flexDirection="column">
      {transactions.map((tx) => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
      })}
    </Flex>
  )
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const allTransactions = useAllTransactions()

  const { t } = useTranslation()

  const sortedRecentTransactions = orderBy(
    Object.values(allTransactions).filter(isTransactionRecent),
    'addedTime',
    'desc',
  )

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <ParentModal>
      <Modal
        id="modallast"
        title={t('Recent Transactions')}
        headerBackground="gradients.cardHeader"
        onDismiss={onDismiss}
      >
        {account ? (
          <ModalBody>
            {!!pending.length || !!confirmed.length ? (
              <>
                <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                  <Text color="#60C5BA">{t('Recent Transactions')}</Text>
                  <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                    {t('clear all')}
                  </Button>
                </AutoRow>
                {renderTransactions(pending)}
                {renderTransactions(confirmed)}
              </>
            ) : (
              <Text style={{textAlign: 'center'}}>{t('No recent transactions')}</Text>
            )}
          </ModalBody>
        ) : (
          <ConnectWalletButton />
        )}
      </Modal>
    </ParentModal>
  )
}

export default TransactionsModal
