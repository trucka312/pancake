import styled, { css } from 'styled-components'
import { Heading, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const StyledHeading = styled(Heading) <{ $isDarkStyle?: boolean }>`
  color: #000;
  font-weight: 600;
  font-size: 44px;
  line-height: 44px;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #000;
  `}
`

const StyledBodyText = styled(Text) <{ $isDarkStyle?: boolean }>`
  color: #000;
  font-size: 16px;
  
  ${(props) => props.$isDarkStyle ? css`
  color: #fff;
  ` : css`
  color: #000;
  `}
`

const StatCardContent: React.FC<{
  headingText: string
  bodyText: string
  highlightColor: string
  lastWordColor: string
  style: any
}> = ({ headingText, bodyText, highlightColor, lastWordColor, style }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallerScreen = isMobile || isTablet
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')
  const { theme } = useTheme()

  return (
    <Flex
      minHeight={[null, null, null, '168px']}
      minWidth="232px"
      width="fit-content"
      flexDirection="column"
      justifyContent="flex-end"
      // mt={[null, null, null, '64px']}
      style={{ alignItems: 'center', ...style }}
    >
      {isSmallerScreen && remainingWords.length > 13 ? (
        <StyledHeading $isDarkStyle={theme.isDark} scale="lg">
          {remainingWords}
        </StyledHeading>
      ) : (
        <StyledHeading $isDarkStyle={theme.isDark} scale="xl">
          {remainingWords}
        </StyledHeading>
      )}
      <Heading color={highlightColor} scale="xl" mb="0px">
        <span style={{ color: `${lastWordColor}`, textTransform: 'capitalize' }}>{lastWord}</span>
      </Heading>
      <StyledBodyText $isDarkStyle={theme.isDark} color="textSubtle">
        {bodyText}
      </StyledBodyText>
    </Flex>
  )
}

export default StatCardContent
