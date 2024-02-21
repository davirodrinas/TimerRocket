import {useContext, useEffect} from 'react'
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from 'date-fns';
import { CyclesContext } from '../../../../Contexts/CyclesContext';


export function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassaed, setSecondsPassaed } = useContext(CyclesContext)
  

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassaed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassaed(secondsDifference)
        }
        
      }, 1000)
    }

      return () => {
        clearInterval(interval)
      }

  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassaed])

  const currentSeconts = activeCycle ? totalSeconds - amountSecondsPassaed : 0

  const minutesAmount = Math.floor(currentSeconts / 60)
  const secondsAmount = currentSeconts % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

    return (
        <CountdownContainer>
        <span>{minutes[0]}</span>
        <span>{minutes[1]}</span>
        <Separator>:</Separator>
        <span>{seconds[0]}</span>
        <span>{seconds[1]}</span>
      </CountdownContainer>
    )
}