import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HelpIcon,
  Skeleton,
  Text,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { AnimatedBalance as Balance } from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useMemo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
    max-width: 340px;
  }
  background: transparent;
`

const BountyCard = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = usePriceCakeBusd()

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <Text mb="16px">{t('This bounty is given as a reward for providing a service to other users.')}</Text>
      <Text mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto CAKE Pool’s compounding function for everyone.',
        )}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {t('Auto-Compound Bounty: %fee%% of all Auto CAKE pool users pending yield', { fee: fee / 100 })}
      </Text>
    </>
  )

  const [onPresentBountyModal] = useModal(
    <BountyModal
      estimatedCakeBountyReward={estimatedCakeBountyReward}
      totalPendingCakeHarvest={totalPendingCakeHarvest}
      callFee={callFee}
      cakePriceBusd={cakePriceBusd}
      TooltipComponent={TooltipComponent}
    />,
    true,
    true,
    'bountyModal',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody style={{ background: isDark ? '#50A69C' : '#fff', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color={isDark ? '#fff' : '#000'} mr="4px">
                {t('Auto CAKE Bounty')}
              </Text>
              <Box ref={targetRef}>
                <HelpIcon color={isDark ? '#fff' : '#000'} />
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {hasFetchedCakeBounty ? (
                  <Balance fontSize="20px" bold value={cakeBountyToDisplay} decimals={3} />
                ) : (
                  <Skeleton height={20} width={96} mb="2px" />
                )}
              </Heading>
              {hasFetchedDollarBounty ? (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  value={dollarBountyToDisplay}
                  decimals={2}
                  unit=" USD"
                  prefix="~"
                />
              ) : (
                <Skeleton height={16} width={62} />
              )}
            </Flex>
            <Button
              disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
              onClick={onPresentBountyModal}
              scale="sm"
              px='24px'
              py='23px'
              id="clickClaimVaultBounty"
              style={{ background: isDark ? '#60C5BA' : '#60C5BA', border: '1px solid #60C5BA', color: '#fff', borderRadius: '30px' }}
            >
              {t('Claim')}
            </Button>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
