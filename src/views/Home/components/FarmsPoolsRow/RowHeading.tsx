import { Heading, TextProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

interface HeadingProps extends TextProps {
  text: string
  highlightedColor: string
  unhighlightedWords: number
}

const RowHeading: React.FC<HeadingProps> = ({ text, ...props }) => {
  const { theme } = useTheme()
  const splitArr = text.split(' ')
  const firstWords = splitArr.slice(0, props.unhighlightedWords).join(' ')
  const remainingWords = splitArr.slice(props.unhighlightedWords).join(' ')

  return (
    <Heading {...props}>
      {firstWords}
      <span style={{ color: `${props.highlightedColor ? props.highlightedColor : theme.colors.secondary}` }}>
        {' '}
        {remainingWords}
      </span>
    </Heading>
  )
}

export default RowHeading
