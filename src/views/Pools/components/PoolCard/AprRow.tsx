import { Flex, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import Apr from 'views/Pools/components/Apr'
import useTheme from 'hooks/useTheme'

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
  style?: any
  showIcon?: boolean
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0, style, showIcon = true }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { vaultKey } = pool

  const tooltipContent = vaultKey
    ? t('APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <Flex alignItems="center" justifyContent="space-between" style={style}>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} color={theme.isDark ? '#fff' : '#000'}>{vaultKey ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText>
      <Apr
        pool={pool}
        stakedBalance={stakedBalance}
        performanceFee={performanceFee}
        showIcon={showIcon}
      />
    </Flex>
  )
}

export default AprRow
