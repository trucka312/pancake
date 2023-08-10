// import { SubMenuItems } from '@pancakeswap/uikit'
// import { useTranslation } from 'contexts/Localization'
import { PageMeta } from 'components/Layout/Page'
import useTheme from 'hooks/useTheme'
// import { useRouter } from 'next/router'
import { useFetchIfoPool } from 'state/pools/hooks'
import styled from 'styled-components'
import Hero from './components/Hero'

const IfosWrapper = styled.div`
  background-color: #fff;
`

export const IfoPageLayout = ({ children }) => {
  // const { t } = useTranslation()
  // const router = useRouter()
  // const isExact = router.route === '/ifo'
  useFetchIfoPool()

  const { theme } = useTheme()

  return (
    <IfosWrapper style={{ backgroundColor: `${theme.isDark ? theme.colors.bgDark : theme.colors.bgBright}` }}>
      <PageMeta />
      {/* <SubMenuItems
        items={[
          {
            label: t('Latest'),
            href: '/ifo',
          },
          {
            label: t('Finished'),
            href: '/ifo/history',
          },
        ]}
        activeItem={isExact ? '/ifo' : '/ifo/history'}
      /> */}
      <Hero />
      {children}
    </IfosWrapper>
  )
}
