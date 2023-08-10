import { useTranslation } from 'contexts/Localization'
import { ContextData, TranslationKey } from 'contexts/Localization/types'

export interface TransProps extends ContextData {
  children: TranslationKey
}

const Trans = ({ children, ...props }: TransProps) => {
  const { t } = useTranslation()
  if (typeof children !== 'string') {
    throw new Error('children not string in Trans is not supported yet')
  }
  return <div>{t(children, props)}</div>
}

export default Trans
