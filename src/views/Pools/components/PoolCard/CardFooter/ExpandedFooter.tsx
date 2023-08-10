import { memo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from '@pancakeswap/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { BIG_ZERO } from 'utils/bigNumber'
import MaxStakeRow from '../../MaxStakeRow'

interface ExpandedFooterProps {
  pool: DeserializedPool
  account: string
  labelColor?: string
  valueColor?: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account, labelColor, valueColor }) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    sousId,
    vaultKey,
    profileRequirement,
    isFinished,
  } = pool

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useVaultPoolByKey(vaultKey)

  const vaultPools = useVaultPools()
  const cakeInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalCakeInVault)
  }, BIG_ZERO)

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = getVaultPoolAddress(vaultKey)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const isManualCakePool = sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (vaultKey) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(cakeInVaults)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  return (
    <ExpandedWrapper flexDirection="column">
      <div style={{ margin: '24px 0' }}>
        {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
          <Flex mb="8px" justifyContent="space-between">
            <Text color={labelColor || '#fff'} small>
              {t('Requirement')}:
            </Text>
            <Text small textAlign="right">
              {profileRequirement.required && t('Pancake Profile')}{' '}
              {profileRequirement.thresholdPoints.gt(0) && (
                <Text color={valueColor || '#fff'} small>
                  {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
                </Text>
              )}
            </Text>
          </Flex>
        )}
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text color={labelColor || '#fff'} small>
            {t('Total staked')}:
          </Text>
          <Flex alignItems="flex-start">
            {totalStaked && totalStaked.gte(0) ? (
              <>
                <Balance
                  color={valueColor || '#fff'}
                  small
                  value={getTotalStakedBalance()}
                  decimals={0}
                  unit={` ${stakingToken.symbol}`}
                />
                <span ref={totalStakedTargetRef}>
                  <HelpIcon color={valueColor || '#fff'} width="20px" ml="6px" mt="4px" />
                </span>
              </>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
            {totalStakedTooltipVisible && totalStakedTooltip}
          </Flex>
        </Flex>
        {!isFinished && stakingLimit && stakingLimit.gt(0) && (
          <MaxStakeRow
            small
            currentBlock={currentBlock}
            hasPoolStarted={hasPoolStarted}
            stakingLimit={stakingLimit}
            stakingLimitEndBlock={stakingLimitEndBlock}
            stakingToken={stakingToken}
          />
        )}
        {shouldShowBlockCountdown && (
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
            {blocksRemaining || blocksUntilStart ? (
              <Flex alignItems="center">
                <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
                  <Balance small value={blocksToDisplay} decimals={0} color="primary" />
                  <Text color={labelColor || '#fff'} small ml="4px" textTransform="lowercase">
                    {t('Blocks')}
                  </Text>
                  <TimerIcon ml="4px" color="primary" />
                </Link>
              </Flex>
            ) : (
              <Skeleton width="54px" height="21px" />
            )}
          </Flex>
        )}
        {vaultKey && (
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            {tooltipVisible && tooltip}
            <TooltipText color={labelColor || '#fff'} ref={targetRef} small>
              {t('Performance Fee')}
            </TooltipText>
            <Flex alignItems="center">
              {performanceFee ? (
                <Text color={valueColor || '#fff'} ml="4px" small>
                  {performanceFee / 100}%
                </Text>
              ) : (
                <Skeleton width="90px" height="21px" />
              )}
            </Flex>
          </Flex>
        )}
      </div>

      <div style={{ margin: '0px' }}>
        <Flex mb="2px" justifyContent="flex-start">
          <LinkExternal href={`/info/token/${earningToken.address}`} color={valueColor || '#fff'} bold={false} small>
            <span style={{ color: `${labelColor || '#fff'}` }}>{t('See Token Info')}</span>
          </LinkExternal>
        </Flex>
        <Flex mb="2px" justifyContent="flex-start">
          <LinkExternal href={earningToken.projectLink} color={valueColor || '#fff'} bold={false} small>
            <span style={{ color: `${labelColor || '#fff'}` }}>{t('View Project Site')}</span>
          </LinkExternal>
        </Flex>
        {poolContractAddress && (
          <Flex mb="2px" justifyContent="flex-start">
            <LinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? cakeVaultContractAddress : poolContractAddress}`}
              color={valueColor || '#fff'}
              bold={false}
              small
            >
              <span style={{ color: `${labelColor || '#fff'}` }}>{t('View Contract')}</span>
            </LinkExternal>
          </Flex>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <Flex justifyContent="flex-start">
            <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
            >
              <Text color={labelColor || '#fff'} fontSize="14px">
                {t('Add to Metamask')}
              </Text>
              <MetamaskIcon ml="10px" />
            </Button>
          </Flex>
        )}
      </div>
    </ExpandedWrapper>
  )
}

export default memo(ExpandedFooter)
