import { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { Box, Card, CardBody, CardHeader, Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { Ifo, PoolIds } from 'config/constants/types'
import { useProfile } from 'state/profile/hooks'
import useCriterias from 'views/Ifos/hooks/v3/useCriterias'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useTheme from 'hooks/useTheme'
import { EnableStatus, CardConfigReturn } from '../types'
import IfoCardTokens from './IfoCardTokens'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'

const StyledCard = styled(Card) <{ $bgColor?: string }>`
  background: ${(props) => props.$bgColor};
  max-width: 368px;
  width: 100%;
  margin: 0 auto;
  height: fit-content;
  border-radius: 10px;

  > div {
    background: none;
    border-radius: 0;
  }
`

const StyledCardHeader = styled(CardHeader)`
  padding: 30px 30px 24px 30px;
  background: none;
  border-radius: 0;
`

const StyledCardHeaderText = styled(Text)`
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
`

const StyledCardHeaderIcon = styled.div <{ $color: string }>`
  > svg {
    width: 25px;
    height: 25px;
    display: block;
    fill: ${(props) => props.$color};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 0 30px 30px 30px;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
  bgColor?: string
}

export const cardConfig = (
  t: ContextApi['t'],
  poolId: PoolIds,
  meta: {
    version: number
    needQualifiedPoints?: boolean
    needQualifiedNFT?: boolean
  },
): CardConfigReturn => {
  switch (poolId) {
    case PoolIds.poolBasic:
      if (meta?.version === 3.1) {
        const MSG_MAP = {
          needQualifiedNFT: t('Set PancakeSquad NFT as Pancake Profile avatar.'),
          needQualifiedPoints: t('Reach a certain Pancake Profile Points threshold.'),
        }

        const msgs = Object.keys(meta)
          .filter((criteria) => meta[criteria])
          .map((criteria) => MSG_MAP[criteria])
          .filter(Boolean)

        return {
          title: t('Private Sale'),
          variant: 'blue',
          tooltip: msgs?.length ? (
            <>
              <Text>{t('Meet any one of the requirements to join:')}</Text>
              {msgs.map((msg) => (
                <Text ml="16px" key={msg} as="li">
                  {msg}
                </Text>
              ))}
            </>
          ) : null,
        }
      }

      return {
        title: t('Basic Sale'),
        variant: 'blue',
        tooltip: t(
          'Every person can only commit a limited amount, but may expect a higher return per token committed.',
        ),
      }
    case PoolIds.poolUnlimited:
      return {
        title: meta?.version === 3.1 ? t('Public Sale') : t('Unlimited Sale'),
        variant: 'violet',
        tooltip: t('No limits on the amount you can commit. Additional fee applies when claiming.'),
      }

    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const SmallCard: React.FC<IfoCardProps> = ({ poolId, ifo, publicIfoData, walletIfoData, onApprove, enableStatus, bgColor }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { admissionProfile, pointThreshold } = publicIfoData[poolId]

  const { needQualifiedNFT, needQualifiedPoints } = useMemo(() => {
    return ifo.version === 3.1 && poolId === PoolIds.poolBasic
      ? {
        needQualifiedNFT: Boolean(admissionProfile),
        needQualifiedPoints: pointThreshold ? pointThreshold > 0 : false,
      }
      : {}
  }, [ifo.version, admissionProfile, pointThreshold, poolId])

  const config = cardConfig(t, poolId, {
    version: ifo.version,
    needQualifiedNFT,
    needQualifiedPoints,
  })

  const { hasActiveProfile, isLoading: isProfileLoading } = useProfile()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  const isLoading = isProfileLoading || publicIfoData.status === 'idle'

  const { isEligible, criterias } = useCriterias(walletIfoData[poolId], {
    needQualifiedNFT,
    needQualifiedPoints,
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard $bgColor={theme.isDark ? theme.colors.bgDark : theme.colors.bgBright}>
        <StyledCardHeader p="16px 24px" variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <StyledCardHeaderText color={theme.colors.itemPrimary} bold fontSize="20px" lineHeight={1}>
              {config.title}
            </StyledCardHeaderText>
            <StyledCardHeaderIcon $color={theme.colors.itemPrimary} ref={targetRef}>
              <HelpIcon />
            </StyledCardHeaderIcon>
          </Flex>
        </StyledCardHeader>
        <StyledCardBody p="12px">
          <IfoCardTokens
            criterias={criterias}
            isEligible={isEligible}
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            hasProfile={hasActiveProfile}
            isLoading={isLoading}
            onApprove={onApprove}
            enableStatus={enableStatus}
            bgColor={bgColor}
          />
          <Box mt="24px">
            <IfoCardActions
              isEligible={isEligible}
              poolId={poolId}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              hasProfile={hasActiveProfile}
              isLoading={isLoading}
              enableStatus={enableStatus}
            />
          </Box>
          <IfoCardDetails
            isEligible={isEligible}
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
          />
        </StyledCardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
