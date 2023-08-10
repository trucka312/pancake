import { useState, useRef, useEffect } from 'react'
import useTheme from 'hooks/useTheme'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Box, BoxProps, Text } from '@pancakeswap/uikit'

const DropDownHeader = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 6px;
  // background: ${({ theme }) => theme.colors.input};
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? 'rgba(0, 0, 0, 0.5)' : '#fff')};
    border: 1px solid #60C5BA;
  }
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div<{ $isDark: boolean }>`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#372F47' : '#fff')};
  }
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const DropDownContainer = styled(Box)<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  // background: ${({ theme }) => theme.colors.input};
  border-radius: 6px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 6px 6px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        border-radius: 0 0 6px 6px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface SelectProps extends BoxProps {
  options: OptionProps[]
  onOptionChange?: (option: OptionProps) => void
  placeHolderText?: string
  defaultOptionIndex?: number
}

export interface OptionProps {
  label: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  placeHolderText,
  ...props
}) => {
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [optionSelected, setOptionSelected] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(defaultOptionIndex)
  const { isDark } = useTheme()

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)
    setOptionSelected(true)

    if (onOptionChange) {
      onOptionChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} {...props}>
      <DropDownHeader $isDark={isDark} onClick={toggling}>
        <Text color={!optionSelected && placeHolderText ? 'text' : undefined}>
          {!optionSelected && placeHolderText ? placeHolderText : options[selectedOptionIndex].label}
        </Text>
      </DropDownHeader>
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer $isDark={isDark}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            placeHolderText || index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
