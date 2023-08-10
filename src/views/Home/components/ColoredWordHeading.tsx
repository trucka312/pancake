import { Colors, Heading, TextProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

interface HeadingProps extends TextProps {
  text: string
  firstColor?: keyof Colors
  firstColorCustomized?: string
  numberOfColoredWords?: number
  style?: any
}

const ColoredWordHeading: React.FC<HeadingProps> = ({ text, firstColor, mb = '24px', ...props }) => {
  const { theme } = useTheme()
  const num = props.numberOfColoredWords ? props.numberOfColoredWords : 1

  // Get words to be colored:
  const words = text.split(' ')
  const wordsToBeColored = words.slice(0, num).join(' ')
  const remainingWords = words.slice(num).join(' ')

  let displayedColor = props.firstColorCustomized
  if (!displayedColor) {
    displayedColor = (theme.colors[firstColor] as string) ?? theme.colors.secondary
  }

  return (
    <Heading scale="xl" mb={mb} {...props} style={{ ...props.style }}>
      <span style={{ color: displayedColor }}>{wordsToBeColored} </span>
      {remainingWords}
    </Heading>
  )
}

export default ColoredWordHeading
