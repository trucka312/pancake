import React, { useEffect } from 'react'
import { Button } from '@pancakeswap/uikit'
import Link from 'next/link'
import styled from 'styled-components'
import { useTheme } from 'styled-components'

const ParentLink = styled.div<{ $isDark: boolean }>`
  margin-bottom: 30px;
  margin-left: 12px;
  padding: 5px 3px;
  border-bottom: 1px solid #0b3854;
  opacity: 0.7;
  &.active {
    background-color: transparent;
    border-bottom: 1px solid #60c5ba;
    opacity: 1;
  }
  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 10px 16px;
    background-color: ${({ $isDark }) => ($isDark ? '#101722' : '#fff')};
    border-radius: 16px;
    &.active {
        background-color: #60c5ba;
        border: 1px solid #0b3854;
        opacity: 1;
      }
  }
`
const ActiveLink = ({ route }) => {
    const { isDark } = useTheme()
    //Create data link button - Router
    const linkData = [
        {
            title: 'Exchange',
            href: '/swap',
            id: 'swap',
        },
        {
            title: 'Liquidity',
            href: '/liquidity',
            id: 'liquidity',
        },
        {
            title: 'Limit Orders',
            href: '/limit-orders',
            id: 'limit-orders',
        },
        // {
        //     title: 'Chart',
        //     href: '/chart',
        //     id: 'chart',
        // },
    ]
    useEffect(() => {
        linkData.map((e) => {
            if (route == e.href) {
                const temp = document.querySelector('#' + e.id)
                let currenClass = temp.getAttribute('class')
                temp.setAttribute('class', currenClass + ' active')
            }
        })
    })
    return (
        <>
            <div style={{ display: 'flex' }}>
                {linkData.map((e) => (
                    <Link href={e.href} passHref>
                        <ParentLink id={e.id} $isDark={isDark}>
                            {e.title}
                        </ParentLink>
                    </Link>
                ))}
            </div>
        </>
    )
}
export default ActiveLink
