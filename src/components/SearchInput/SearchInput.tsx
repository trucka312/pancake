import { useState, useMemo } from 'react'
import useTheme from 'hooks/useTheme'
import { Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)<{ $isDark: boolean }>`
  border-radius: 6px;
  margin-left: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? 'rgba(0,0,0,0.5)' : '#fff')};
  }
  border: 1px solid #60C5BA;
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [searchText, setSearchText] = useState('')

  const { isDark } = useTheme()
  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <InputWrapper>
      <StyledInput $isDark={isDark} value={searchText} onChange={onChange} placeholder={t(placeholder)} />
    </InputWrapper>
  )
}

export default SearchInput
