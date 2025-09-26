'use client'

import { GamePlayer } from '@/components/GamePlayer'
import { useParams } from 'react-router-dom'

const GamePage = () => {
  const { name } = useParams()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '2rem',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          // [theme.breakpoints.up('md')]: {
          //   maxWidth: '60rem',
          //   padding: 0,
          // },
        }}
      >
        <GamePlayer name={name} />
      </div>
    </div>
  )
}

export default GamePage