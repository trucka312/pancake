import { useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import Trans from './Trans'
import { BasicButton } from '../../packages/uikit/src/components/Button/index.stories'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <BasicButton
      onClick={onPresentConnectModal}
      variant='customPrimary'
      {...props}
    >
      {children || <Trans>Connect Wallet</Trans>}
    </BasicButton>
  )
}

export default ConnectWalletButton
