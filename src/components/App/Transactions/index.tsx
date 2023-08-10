import { HistoryIcon, Button, useModal } from '@pancakeswap/uikit'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal}>
        <HistoryIcon color="#0B3854" width="24px" />
      </Button>
    </>
  )
}

export default Transactions
