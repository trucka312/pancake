import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableLabel,
  ExpandableButton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useEffect, useState } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { requiresApproval } from 'utils/requiresApproval'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useCatchTxError from 'hooks/useCatchTxError'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useTheme from 'hooks/useTheme'
import useIfoApprove from '../../hooks/useIfoApprove'
import IfoAchievement from './Achievement'
import IfoPoolCard from './IfoPoolCard'
import { EnableStatus } from './types'
import { IfoRibbon } from './IfoRibbon'
import { CardsWrapper } from '../IfoCardStyles'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const StyledCard = styled(Card) <{
  $isCurrent?: boolean,
  $bgColor?: string,
  $borderColor?: string
}>`
  width: 100%;
  margin: auto;
  padding: 0;
  border-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$borderColor};
  margin-bottom: 30px;

  ${({ $isCurrent }) =>
    $isCurrent &&
    `
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  `}

  > div {
    // background: ${({ theme, $isCurrent }) =>
    $isCurrent ? theme.colors.gradients.bubblegum : theme.colors.dropdown};
    background: none;
    border-radius: 10px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    > div {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
`

const Header = styled(CardHeader) <{ ifoId: string; $isCurrent?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${({ $isCurrent }) => ($isCurrent ? '64px' : '112px')};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg'), url('/images/ifos/${ifoId}-bg.png')`};
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

const StyledCardsWrapper = styled(CardsWrapper) <{ singleCard: boolean; shouldReverse: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: ${({ singleCard }) => (singleCard ? '1fr' : '1fr 1fr')};
    justify-items: ${({ singleCard }) => (singleCard ? 'center' : 'unset')};
  }

  > div:nth-child(1) {
    order: ${({ shouldReverse }) => (shouldReverse ? 2 : 1)};
  }

  > div:nth-child(2) {
    order: ${({ shouldReverse }) => (shouldReverse ? 1 : 2)};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 30px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  padding: 0;
  // background: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
  background: none;
  border: none;
`

const StyledNoHatBunny = styled.div<{ $isLive: boolean; $isCurrent?: boolean }>`
  position: absolute;
  left: -24px;
  z-index: 1;
  top: 33px;

  > img {
    width: 78px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    top: ${({ $isLive }) => ($isLive ? '46px' : '33px')};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    left: auto;
    top: ${({ $isLive }) => ($isLive ? '61px' : '48px')};
    right: ${({ $isCurrent }) => ($isCurrent ? '17px' : '90px')};

    > img {
      width: 123px;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: ${({ $isCurrent }) => ($isCurrent ? '67px' : '90px')};
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 90px;
  }
`

const NoHatBunny = ({ isLive, isCurrent }: { isLive?: boolean; isCurrent?: boolean }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isSmallerThanTablet = isXs || isSm || isMd
  if (isSmallerThanTablet && isLive) return null
  return (
    <StyledNoHatBunny $isLive={isLive} $isCurrent={isCurrent}>
      <img
        src={`/images/ifos/assets/bunnypop-${!isSmallerThanTablet ? 'right' : 'left'}.png`}
        width={123}
        height={162}
        alt="bunny"
      />
    </StyledNoHatBunny>
  )
}

const StyledExpandableLabelWrapper = styled.div <{ $isExpanded: boolean, $bgColor?: string, $borderColor?: string }>`
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$borderColor};
  border-radius: ${({ $isExpanded }) => ($isExpanded ? '10px 10px 0 0' : '10px')};
`

// Active Ifo
export const IfoCurrentCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const shouldShowBunny = publicIfoData.status === 'live' || publicIfoData.status === 'coming_soon'

  return (
    <>
      {isMobile && (
        <Box
          className="sticky-header"
          position="sticky"
          bottom="48px"
          width="100%"
          zIndex={6}
          maxWidth={['400px', '400px', '400px', '100%']}
        >
          <Header $isCurrent ifoId={ifo.id} />
          <IfoRibbon publicIfoData={publicIfoData} />
          {shouldShowBunny && <NoHatBunny isLive={publicIfoData.status === 'live'} />}
        </Box>
      )}
      <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '100%']}>
        {!isMobile && shouldShowBunny && <NoHatBunny isCurrent isLive={publicIfoData.status === 'live'} />}
        <StyledCard
          $isCurrent
          $bgColor={theme.isDark ? theme.colors.bgDarkWeaker : '#fff'}
          $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
        >
          {!isMobile && (
            <>
              {/* <Header $isCurrent ifoId={ifo.id} /> */}
              <IfoRibbon publicIfoData={publicIfoData} />
            </>
          )}
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        </StyledCard>
        <StyledCardFooter>
          <StyledExpandableLabelWrapper
            $isExpanded={isExpanded}
            $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
            $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
          >
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Details')}
            </ExpandableLabel>
          </StyledExpandableLabelWrapper>
          {isExpanded && <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />}
        </StyledCardFooter>
      </Box>
    </>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

// Past Ifo
const IfoFoldableCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Box position="relative">
      {isExpanded && isDesktop && <NoHatBunny isLive={false} />}
      <Box as={StyledCard} borderRadius="32px">
        <Box position="relative">
          <Header ifoId={ifo.id}>
            <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
          </Header>
          {isExpanded && (
            <>
              <IfoRibbon publicIfoData={publicIfoData} />
            </>
          )}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />
        </FoldableContent>
      </Box>
    </Box>
  )
}

const IfoCard: React.FC<IfoFoldableCardProps> = ({ ifo, publicIfoData, walletIfoData }) => {
  const { theme } = useTheme()

  const currentBlock = useCurrentBlock()
  const { fetchIfoData: fetchPublicIfoData, isInitialized: isPublicIfoDataInitialized, secondsUntilEnd } = publicIfoData
  const {
    contract,
    fetchIfoData: fetchWalletIfoData,
    resetIfoData: resetWalletIfoData,
    isInitialized: isWalletDataInitialized,
  } = walletIfoData
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const raisingTokenContract = useERC20(ifo.currency.address, false)
  // Continue to fetch 2 more minutes to get latest data
  const isRecentlyActive =
    (publicIfoData.status !== 'finished' || (publicIfoData.status === 'finished' && secondsUntilEnd >= -120)) &&
    ifo.isActive
  const onApprove = useIfoApprove(ifo, contract.address)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const isWindowVisible = useIsWindowVisible()

  useEffect(() => {
    if (isRecentlyActive || !isPublicIfoDataInitialized) {
      fetchPublicIfoData(currentBlock)
    }
  }, [isRecentlyActive, isPublicIfoDataInitialized, fetchPublicIfoData, currentBlock])

  useFastRefreshEffect(() => {
    if (isWindowVisible && (isRecentlyActive || !isWalletDataInitialized)) {
      if (account) {
        fetchWalletIfoData()
      }
    }

    if (!account && isWalletDataInitialized) {
      resetWalletIfoData()
    }
  }, [isWindowVisible, account, isRecentlyActive, isWalletDataInitialized, fetchWalletIfoData, resetWalletIfoData])

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setEnableStatus(EnableStatus.IS_ENABLING)
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now participate in the %symbol% IFO.', { symbol: ifo.token.symbol })}
        </ToastDescriptionWithTx>,
      )
      setEnableStatus(EnableStatus.ENABLED)
    } else {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }

  useEffect(() => {
    const checkAllowance = async () => {
      const approvalRequired = await requiresApproval(raisingTokenContract, account, contract.address)
      setEnableStatus(approvalRequired ? EnableStatus.DISABLED : EnableStatus.ENABLED)
    }

    if (account) {
      checkAllowance()
    }
  }, [account, raisingTokenContract, contract, setEnableStatus])

  return (
    <>
      <StyledCardBody>
        <StyledCardsWrapper
          shouldReverse={ifo.version === 3.1}
          singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}
        >
          {publicIfoData.poolBasic && walletIfoData.poolBasic && (
            <IfoPoolCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              onApprove={handleApprove}
              enableStatus={enableStatus}
              bgColor={theme.colors.itemBlueHighlight}
            />
          )}
          <IfoPoolCard
            poolId={PoolIds.poolUnlimited}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            onApprove={handleApprove}
            enableStatus={enableStatus}
            bgColor={theme.colors.itemPrimary}
          />
        </StyledCardsWrapper>
      </StyledCardBody>
    </>
  )
}

export default IfoFoldableCard
