import styled, { css } from 'styled-components'
import { Flex, Text, Link } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from 'components/NextLink'
import useTheme from 'hooks/useTheme'
import { CompositeImageProps } from '../CompositeImage'
// import ColoredWordHeading from '../ColoredWordHeading'
import { BasicButton } from '../../../../../packages/uikit/src/components/Button/index.stories'

interface SalesSectionButton {
  to: string
  text: string
  external: boolean
}

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButton
  secondaryButton: SalesSectionButton
  images: CompositeImageProps
  numberOfWords: number
  layoutType?: string
}

const StyledSectionWrapper = styled(Flex) <{ $type?: string }>`
  ${(props) =>
    props.$type === 'to-left' &&
    css`
      width: 50%;
      // padding-right: 24px;
    `}
`

const StyledContentWrapper = styled(Flex) <{ $type?: string }>`
  ${(props) =>
    props.$type === 'to-left' &&
    css`
      align-items: flex-start;
    `}
`

const StyledHeadingWrapper = styled(Text) <{ $type?: string }>`
  display: inline-block;
  text-align: center;
  // margin-bottom: 40px;
  margin-bottom: 12px;

  ${(props) =>
    props.$type === 'to-left' &&
    css`
      text-align: left;
    `}

  && div {
    display: inline;
  }

  @media screen and (max-width: 1400px) {
    // margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    // margin-bottom: 15px;
  }
`

const StyledHeading = styled(Text) <{ $isHighlighted?: boolean, $type?: string, $isDarkStyle?: boolean }>`
  color: #000;
  font-style: normal;
  font-weight: 500;
  font-size: 64px;
  line-height: 100%;
  text-align: center;
  margin: 0;
  padding: 0;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #0b3854;
  `}

  ${(props) => props.$isHighlighted && css`
    color: #60c5ba;
  `}

  ${(props) => props.$type === 'to-left' && css`
    text-align: left;
  `}

  @media screen and (max-width: 1400px) {
    font-size: 50px;
    line-height: 53px;
  }

  @media screen and (max-width: 576px) {
    font-size: 35px;
    line-height: 38px;
  }
`

const StyledText = styled(Text) <{ $type?: string, $isDarkStyle?: boolean }>`
  color: #000;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 100%;
  text-align: center;
  margin-bottom: 40px;

  ${(props) => props.$isDarkStyle ? css`
    color: #fff;
  ` : css`
    color: #000;
  `}

  ${(props) => props.$type === 'to-left' && css`
    text-align: left;
  `}

  @media screen and (max-width: 1400px) {
    font-size: 23px;
    line-height: 24px;
    // margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
    // margin-bottom: 15px;
  }
`

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { headingText, bodyText, reverse, primaryButton, secondaryButton, numberOfWords = 0, layoutType = 'default' } = props
  const highlightedWords = numberOfWords === 0 ? 0 : numberOfWords
  const { theme } = useTheme()

  return (
    <StyledSectionWrapper flexDirection="column" $type={layoutType}>
      <Flex
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <StyledContentWrapper
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flex="1"
          alignSelf={['flex-start', null, null, 'center']}
          $type={layoutType}
        >
          <StyledHeadingWrapper $type={layoutType}>
            <StyledHeading $type={layoutType} $isDarkStyle={theme.isDark} $isHighlighted>{headingText.split(' ', highlightedWords).join(' ')}</StyledHeading>
            <StyledHeading $type={layoutType} $isDarkStyle={theme.isDark}> </StyledHeading>
            <StyledHeading $type={layoutType} $isDarkStyle={theme.isDark}>{headingText.split(' ').slice(highlightedWords).join(' ')}</StyledHeading>
          </StyledHeadingWrapper>

          <StyledText $type={layoutType} $isDarkStyle={theme.isDark} color="textSubtle" mb="24px">
            {bodyText}
          </StyledText>

          <Flex justifyContent="center" alignItems="center">
            <BasicButton variant='customPrimary' mr="16px">
              {primaryButton.external ? (
                <Link external href={primaryButton.to}>
                  <Text color="#EC4C93" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </Link>
              ) : (
                <RouterLink to={primaryButton.to}>
                  <Text color="card" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </RouterLink>
              )}
            </BasicButton>
            {secondaryButton.external ? (
              <Link
                external
                href={secondaryButton.to}
                color="#fff"
                p="0"
              >
                <BasicButton variant='customSecondary' mr="0px">
                  {secondaryButton.text}
                </BasicButton>
              </Link>
            ) : (
              <RouterLink to={secondaryButton.to}>{secondaryButton.text}</RouterLink>
            )}
          </Flex>
        </StyledContentWrapper>
      </Flex>
    </StyledSectionWrapper>
  )
}

export default SalesSection
