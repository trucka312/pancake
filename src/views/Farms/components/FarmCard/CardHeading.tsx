import styled from 'styled-components'
import { Tag, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { FarmAuctionTag, CoreTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading mb="4px" color="#60C5BA">
          {lpLabel.split(' ')[0]}
        </Heading>
        <Flex justifyContent="center">
          {isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}
          {multiplier ? (
            <MultiplierTag>{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </Flex>
      </Flex>
      <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
    </Wrapper>
  )
}

export default CardHeading
