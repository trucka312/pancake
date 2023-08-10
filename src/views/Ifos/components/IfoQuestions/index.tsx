/* eslint-disable react/no-array-index-key */
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import useTheme from 'hooks/useTheme'
import config from './config'

// const ImageWrapper = styled.div`
//   flex: none;
//   order: 2;
//   max-width: 414px;
//   width: 100%;

//   ${({ theme }) => theme.mediaQueries.md} {
//     order: 1;
//   }
// `

const DetailsWrapper = styled.div`
  order: 1;
  // margin-bottom: 40px;
  margin: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    // margin-bottom: 0;
    // margin-left: 40px;
    margin: 0;
  }
`

const StyledCard = styled(Card) <{ $bgColor?: string, $borderColor?: string }>`
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$borderColor};
  border-radius: 10px 10px 0px 0px;
  padding: 0;

  > div {
    background: none;
    border-radius: 0;
  }
`

const StyledCardHeader = styled(CardHeader) <{ $bgColor?: string, $borderColor?: string }>`
  background: ${(props) => props.$bgColor};
  border: ${(props) => `1px solid ${props.$borderColor}` || 'none'};
  border-radius: 10px 10px 0px 0px;
  padding: 32px;
`

const StyledCardHeading = styled(Heading)`
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  text-transform: uppercase;
  text-align: center;
`

const StyledFoldableText = styled(FoldableText) <{ $txtColor?: string, $borderColor?: string }>`
  margin: 0;
  padding: 12px 24px;
  border-bottom: ${(props) => `1px solid ${props.$borderColor}` || 'none'};

  :last-child {
    border-bottom: none;
  }

  > div:nth-child(1) {
    padding: 0;
  }

  > div > div {
    color: ${(props) => props.$txtColor || '#000'};
    font-weight: 500;
  }
`

const StyledText = styled(Text)`
  font-size: 16px;
  line-height: 21px;
  margin: 10px 0px;
`

const IfoQuestions = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      {/* <ImageWrapper>
        <Image src="/images/ifos/ifo-bunny.png" alt="ifo bunny" width={414} height={500} />
      </ImageWrapper> */}

      <DetailsWrapper>
        <StyledCard
          $bgColor={theme.isDark ? 'rgba(30, 39, 53, 0.8)' : '#fff'}
          $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : '#fff'}
        >
          <StyledCardHeader
            $bgColor={theme.isDark ? theme.colors.bgDark : '#fff'}
          >
            <StyledCardHeading scale="lg" color={theme.isDark ? '#fff' : '#000'}>
              {t('Details')}
            </StyledCardHeading>
          </StyledCardHeader>
          <CardBody p="0">
            {config.map(({ title, description }, i, { length }) => {
              return (
                <StyledFoldableText
                  key={i} mb={i + 1 === length ? '' : '24px'}
                  title={title}
                  $txtColor={theme.isDark ? '#fff' : '#000'}
                  $borderColor={theme.isDark ? theme.colors.itemBlueUnhighlight : theme.colors.bgBright}
                  isLineBreakHided
                >
                  {description.map((desc, index) => {
                    return (
                      <StyledText key={index} color={theme.colors.itemPrimary} as="p">
                        {desc}
                      </StyledText>
                    )
                  })}
                </StyledFoldableText>
              )
            })}
          </CardBody>
        </StyledCard>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
