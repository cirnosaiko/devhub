import { getItemNodeIdOrId, isItemRead, isItemSaved } from '@devhub/core'
import React, { useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useItem } from '../../hooks/use-item'
import { SwipeableRow } from '../../libs/swipeable'
import * as actions from '../../redux/actions'
import { useTheme } from '../context/ThemeContext'
import { CardWithLink, CardWithLinkProps } from './CardWithLink'

export interface SwipeableCardProps extends CardWithLinkProps {}

export function SwipeableCard(props: CardWithLinkProps) {
  const { columnId, nodeIdOrId, ownerIsKnown, repoIsKnown, type } = props

  const swipeableRef = useRef<SwipeableRow>(null)
  const theme = useTheme()
  const dispatch = useDispatch()
  const item = useItem(nodeIdOrId)
  const isRead = isItemRead(item)

  function handleMarkAsRead() {
    dispatch(
      actions.markItemsAsReadOrUnread({
        type,
        itemNodeIdOrIds: [getItemNodeIdOrId(item)!],
        localOnly: false,
        unread: isRead,
      }),
    )
  }

  function handleSave() {
    dispatch(
      actions.saveItemsForLater({
        itemNodeIdOrIds: [getItemNodeIdOrId(item)!],
        save: !isItemSaved(item),
      }),
    )
  }

  const Content = useMemo(() => <CardWithLink {...props} isInsideSwipeable />, [
    columnId,
    item,
    ownerIsKnown,
    repoIsKnown,
    type,
  ])

  return (
    <SwipeableRow
      ref={swipeableRef}
      leftActions={[
        {
          ...(!isRead
            ? {
                backgroundColor: theme.backgroundColorDarker2,
                foregroundColor: theme.foregroundColor,
              }
            : {
                backgroundColor: theme.primaryBackgroundColor,
                foregroundColor: theme.primaryForegroundColor,
              }),
          iconFamily: 'octicons',
          icon: isRead ? 'primitive-dot' : 'mail-read',
          key: 'read',
          label: 'Read',
          onPress: handleMarkAsRead,
          type: 'FULL',
        },
      ]}
      rightActions={[
        {
          ...(isItemSaved(item)
            ? {
                backgroundColor: theme.backgroundColorDarker2,
                foregroundColor: theme.foregroundColor,
              }
            : {
                backgroundColor: theme.primaryBackgroundColor,
                foregroundColor: theme.primaryForegroundColor,
              }),
          iconFamily: 'material',
          icon: 'bookmark',
          key: 'bookmark',
          label: 'Bookmark',
          onPress: handleSave,
          type: 'FULL',
        },
      ]}
    >
      {Content}
    </SwipeableRow>
  )
}
