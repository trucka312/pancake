import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  NftIcon,
  // NftFillIcon,
  MoreIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
// import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

// const config: (t: ContextApi['t'], languageCode?: string) => ConfigMenuItemsType[] = (t, languageCode) => [
  const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Swap'),
        href: '/swap',
      },
      {
        label: t('Limit'),
        href: '/limit-orders',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
      // {
      //   label: t('Perpetual'),
      //   href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT`,
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
      // {
      //     type: DropdownMenuItemType.DIVIDER,
      //   },
      // {
      //   label: t('Charts'),
      //   href: '/chart',
      // },
    ],
  },
  {
    label: t('Earn'),
    href: '/farms',
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    items: [
      {
        label: t('Farms'),
        href: '/farms',
      },
      {
        label: t('Pools'),
        href: '/pools',
      },
    ],
  },
  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: TrophyIcon,
  //   fillIcon: TrophyFillIcon,
  //   items: [
  //     {
  //       label: t('Trading Competition'),
  //       href: '/competition',
  //     },
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  // {
  //   label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: NftIcon,
  //   fillIcon: NftFillIcon,
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: `${nftsBaseUrl}`,
  //     },
  //     {
  //       label: t('Collections'),
  //       href: `${nftsBaseUrl}/collections`,
  //     },
  //     {
  //       label: t('Activity'),
  //       href: `${nftsBaseUrl}/activity`,
  //     },
  //   ],
  // },
  {
    label: t('Info'),
    href: '/info',
    icon: NftIcon,
    showItemsOnMobile: false,
    // items: [
    //   {
    //     label: t('Info'),
    //     href: '/info',
    //   },
    //   {
    //     label: t('IFO'),
    //     href: '/ifo',
    //   },
    //   {
    //     label: t('Voting'),
    //     href: '/voting',
    //   },
    //   // {
    //   //   type: DropdownMenuItemType.DIVIDER,
    //   // },
    //   // {
    //   //   label: t('Leaderboard'),
    //   //   href: '/teams',
    //   // },
    //   // {
    //   //   type: DropdownMenuItemType.DIVIDER,
    //   // },
    //   // {
    //   //   label: t('Blog'),
    //   //   href: 'https://medium.com/pancakeswap',
    //   //   type: DropdownMenuItemType.EXTERNAL_LINK,
    //   // },
    //   // {
    //   //   label: t('Docs'),
    //   //   href: 'https://docs.pancakeswap.finance',
    //   //   type: DropdownMenuItemType.EXTERNAL_LINK,
    //   // },
    // ],
  },
  {
    label: t('IFO'),
    href: '/ifo',
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    showItemsOnMobile: false,
  },
]

export default config
