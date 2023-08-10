import styled from 'styled-components'
import every from 'lodash/every'
import {
  Stepper,
  Step,
  StepStatus,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Box,
  CheckmarkIcon,
  Flex,
  useTooltip,
  TooltipText,
  LogoRoundIcon,
  Skeleton,
  useModal,
  Link,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from 'components/NextLink'
import { useWeb3React } from '@web3-react/core'

import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import Container from 'components/Layout/Container'
import { useProfile } from 'state/profile/hooks'
import Balance from 'components/Balance'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { getBalanceNumber } from 'utils/formatBalance'
import VaultStakeModal from 'views/Pools/components/CakeVaultCard/VaultStakeModal'
import { BIG_ZERO } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useIfoPoolVault, useIfoPoolCredit, useIfoWithApr } from 'state/pools/hooks'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useCheckVaultApprovalStatus, useVaultApprove } from 'views/Pools/hooks/useApprove'
import useTheme from 'hooks/useTheme'

interface TypeProps {
  ifoCurrencyAddress: string
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

const Wrapper = styled(Container)`
  margin-left: -16px;
  margin-right: -16px;
  // padding-top: 48px;
  // padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

const SmallStakePoolCard = styled(Box)`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const StyledHeading = styled(Heading)`
  font-weight: 500;
  font-size: 32px;
  line-height: 32px;
  margin-bottom: 30px;
`

const StyledListOfSteps = styled.div <{ $bgColorOrImage?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  ::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    top: 7px;
    left: 0;
    background: ${(props) => props.$bgColorOrImage};
    z-index: 1;
  }

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    ::after {
      height: 100%;
      width: 2px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const StyledStepWrapper = styled.div <{ $bgColorOrImage?: string, $borderColor?: string, $dotColor?: string }>`
  flex: 1 1 0%;
  z-index: 2;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    > div {
      margin: 0;
      background: ${(props) => props.$bgColorOrImage || '#000'};
      border: 1px solid ${(props) => props.$borderColor || '#fff'};
      box-sizing: border-box;
      border-radius: 10px;
      margin-right: 24px;
      backdrop-filter: blur(10px);

      > div,
      > div > div {
        background: none;
        border-radius: 0;
        border: none;
        padding: 0;
        margin: 0;
      }
    }

    > div:nth-child(2) {
      position: static;
      margin-bottom: 30px;
      border: none;

      > div:first-child {
        width: 16px;
        height: 16px;
        font-size: 0;
        border: none;
        background: ${(props) => props.$dotColor || '#000'};
        box-shadow: 0px 0px 20px #fff;
        position: relative;
        border-radius: 50%;

        // ::after {
        //   content: '';
        //   position: absolute;
        //   width: 10px;
        //   height: 10px;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        //   background: #fff;
        //   border-radius: 50%;
        // }
      }

      > div:not(:first-child) {
        width: calc(50%);
        height: 2px;
        top: 7px;
        left: 0;
      }

      > div:last-child {
        left: 50%;
      }
    }
  }

  &&:nth-child(1),
  &&:nth-child(3) {
    > div {
      > div:nth-child(1) {
        display: none;
      }
    }
  }

  &&:nth-child(2),
  &&:nth-child(4) {
    > div {
      flex-direction: column-reverse;

      > div:nth-child(3) {
        display: none;
      }
    }
  }

  :last-child {
    > div > div {
      margin-right: 0;
    }
  }

  @media screen and (max-width: 1200px) {
    width: 100%;

    > div > div:not(:nth-child(2)) {
      margin: 24px 0 24px 0;
      width: 100%;
    }

    > div > div:nth-child(2) {
      margin: 0;
    }

    &&:nth-child(2),
    &&:nth-child(4) {
      > div {
        flex-direction: column-reverse;
  
        > div:nth-child(1) {
          display: block;
        }

        > div:nth-child(3) {
          display: none;
        }
      }
    }

    &&:first-child {
      > div > div:nth-child(2) {
        > div:first-child {
          box-shadow: none;
        }
      }
    }

    &&:last-child {
      > div > div:not(:nth-child(2)) {
        margin-bottom: 0;
      }
    }
  }

  @media screen and (max-width: 576px) {
    &&:nth-child(2),
    &&:nth-child(4) {
      > div {
        flex-direction: column;

        > div:nth-child(1) {
          display: none;
        }
  
        > div:nth-child(3) {
          display: block;
        }
      }
    }
  }
`

const Step1 = ({ hasProfile }: { hasProfile: boolean }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const ifoPoolVault = useIfoPoolVault()
  const credit = useIfoPoolCredit()
  const { pool } = useIfoWithApr()

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(pool.vaultKey)
  const { handleApprove, pendingTx } = useVaultApprove(pool.vaultKey, setLastUpdated)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <span>
        {t(
          'IFO credit is calculated by average block balance in the IFO pool in over the staking period announced with each IFO proposal.',
        )}
      </span>{' '}
      <InlineLink
        external
        href="https://medium.com/pancakeswap/initial-farm-offering-ifo-3-0-ifo-staking-pool-622d8bd356f1"
      >
        {t('Please refer to our blog post for more details.')}
      </InlineLink>
    </Box>,
    {},
  )

  const creditDollarValue = useBUSDCakeAmount(getBalanceNumber(credit))

  const stakingTokenBalance = pool?.userData?.stakingTokenBalance
    ? new BigNumber(pool.userData.stakingTokenBalance)
    : BIG_ZERO

  const [onPresentStake] = useModal(
    <VaultStakeModal
      stakingMax={stakingTokenBalance}
      performanceFee={ifoPoolVault.fees.performanceFeeAsDecimal}
      pool={pool}
    />,
  )

  return (
    <CardBody>
      {tooltipVisible && tooltip}
      <Heading as="h4" color="#fff" mb="24px" height="60px">
        {t('Stake CAKE in IFO pool')}
      </Heading>
      <Box>
        <Text color="#fff" small>
          {t(
            'The maximum amount of CAKE user can commit to the Public Sale, is equal to the average CAKE balance in the IFO CAKE pool prior to the IFO. Stake more CAKE to increase the maximum CAKE you can commit to the sale. Missed this IFO? You can keep staking in the IFO CAKE Pool to join the next IFO sale.',
          )}
        </Text>
        <TooltipText
          as="span" fontWeight={700} ref={targetRef}
          color={theme.colors.itemPrimary} small
          style={{ textDecoration: `underline solid ${theme.colors.itemPrimary}` }}>
          {t('How does the IFO credit calculated?')}
        </TooltipText>
      </Box>
      {hasProfile && (
        <SmallStakePoolCard borderRadius="default" p="16px">
          <FlexGap justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="16px">
            <Flex>
              <LogoRoundIcon style={{ alignSelf: 'flex-start' }} width={32} height={32} />
              <Box ml="16px">
                <Text bold fontSize="12px" textTransform="uppercase" color="#fff">
                  {t('Your max CAKE entry')}
                </Text>
                <Balance fontSize="20px" bold decimals={5} value={getBalanceNumber(credit)} />
                <Text fontSize="12px" color="#fff">
                  {creditDollarValue !== undefined ? (
                    <Balance
                      value={creditDollarValue}
                      fontSize="12px"
                      color="#fff"
                      decimals={2}
                      prefix="~"
                      unit=" USD"
                    />
                  ) : (
                    <Skeleton mt="1px" height={16} width={64} />
                  )}
                </Text>
              </Box>
            </Flex>
            {isVaultApproved ? (
              <Button onClick={onPresentStake}>{t('Stake')} CAKE</Button>
            ) : (
              <Button disabled={pendingTx} onClick={handleApprove}>
                {t('Enable pool')}
              </Button>
            )}
          </FlexGap>
        </SmallStakePoolCard>
      )}
    </CardBody>
  )
}

const Step2 = ({ hasProfile, isLive, isCommitted }: { hasProfile: boolean; isLive: boolean; isCommitted: boolean }) => {
  const { t } = useTranslation()
  return (
    <CardBody>
      <Heading as="h4" color="#fff" mb="24px" height="60px">
        {t('Commit CAKE')}
      </Heading>
      <Text color="#fff" small>
        {t('When the IFO sales are live, you can “commit” your CAKE to buy the tokens being sold.')} <br />
      </Text>
      {hasProfile && isLive && !isCommitted && (
        <Button as="a" href="#current-ifo" mt="24px">
          {t('Commit CAKE')}
        </Button>
      )}
    </CardBody>
  )
}

const IfoSteps: React.FC<TypeProps> = ({ isCommitted, hasClaimed, isLive, ifoCurrencyAddress }) => {
  const { hasActiveProfile } = useProfile()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { balance } = useTokenBalance(ifoCurrencyAddress)
  const stepsValidationStatus = [hasActiveProfile, balance.isGreaterThan(0), isCommitted, hasClaimed]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    const renderAccountStatus = () => {
      if (!account) {
        return <ConnectWalletButton />
      }

      if (isStepValid) {
        return (
          <Flex alignItems="center">
            <Text color="success" bold mr="8px">
              {t('Profile Active!')}
            </Text>
            <CheckmarkIcon color="success" />
          </Flex>
        )
      }

      return (
        <Button as={RouterLink} to={`${nftsBaseUrl}/profile/${account.toLowerCase()}`}>
          {t('Activate your Profile')}
        </Button>
      )
    }

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="#fff" mb="24px" height="60px">
              {t('Activate your Profile')}
            </Heading>
            <Text color="#fff" small mb="24px">
              {t('You’ll need an active PancakeSwap Profile to take part in an IFO!')}
            </Text>
            {renderAccountStatus()}
          </CardBody>
        )
      case 1:
        return <Step1 hasProfile={hasActiveProfile} />
      case 2:
        return <Step2 hasProfile={hasActiveProfile} isLive={isLive} isCommitted={isCommitted} />
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="#fff" mb="24px" height="60px">
              {t('Claim your tokens and achievement')}
            </Heading>
            <Text color="#fff" small>
              {t(
                'After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent CAKE tokens will be returned to your wallet.',
              )}
            </Text>
          </CardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <StyledHeading id="ifo-how-to" as="h2" scale="xl" color={theme.isDark ? '#fff' : '#000'} mb="24px" textAlign="center">
        {/* {t('How to Take Part in the Public Sale')} */}
        {t('IFO: Initial Farm Offerings')}
      </StyledHeading>
      <Stepper>
        <StyledListOfSteps
          $bgColorOrImage={theme.colors.itemPrimary}
        >
          {stepsValidationStatus.map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledStepWrapper key={index}
              $bgColorOrImage='linear-gradient(180deg, #1E2735 0%, rgba(30, 39, 53, 0) 100%)'
              $borderColor={theme.colors.itemBlueUnhighlight}
              $dotColor={theme.colors.itemPrimary}
            >
              <Step
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                index={index}
                statusFirstPart={getStatusProp(index)}
                statusSecondPart={getStatusProp(index + 1)}
              >
                <Card>{renderCardBody(index)}</Card>
              </Step>
            </StyledStepWrapper>
          ))}
        </StyledListOfSteps>
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
