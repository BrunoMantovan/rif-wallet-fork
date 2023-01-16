import { useCallback } from 'react'
import { getPin } from '../../storage/MainStorage'
import { PinContainer } from '../../components/PinManager/PinContainer'
import { useState } from 'react'
import { pinLength } from '../../shared/costants'

interface Props {
  unlock: () => void
  resetKeysAndPin: () => void
}

export const RequestPIN = ({ unlock, resetKeysAndPin }: Props) => {
  const [resetEnabled, setResetEnabled] = useState<boolean>(false)
  const checkPin = useCallback(
    (enteredPin: string) => {
      try {
        const storedPin = getPin()
        if (storedPin === enteredPin) {
          unlock()
        } else {
          setResetEnabled(true)
          throw new Error('Pin do not match.')
        }
      } catch (err) {}
    },
    [unlock],
  )

  return (
    <PinContainer
      pinLength={pinLength}
      key={pinLength}
      onPinSubmit={checkPin}
      resetEnabled={resetEnabled}
      resetKeysAndPin={resetKeysAndPin}
    />
  )
}
