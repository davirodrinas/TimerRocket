import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton, } from "./styles";
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds} from 'date-fns'
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema =zod.object({
  task: zod.string().min(1, 'Informe a Tarefa'),
  minutesAmount: zod.number()
  .min(1, 'O Cyclo  precisa ser de no maimo 5 minutos.')
  .max(60, 'O Cyclo  precisa ser de no maimo 60 minutos.'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassaed, setAmountSecondsPassaed] = useState(0)

  const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

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
          setCycles((state) => state.map((cycle) => {
            if (cycle.id == activeCycleId) {
              return { ...cycle, finishedDate: new Date()}
            } else { 
              return cycle
            }
            }),
            )

          setAmountSecondsPassaed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassaed(secondsDifference)
        }
        
      }, 1000)
    }

      return () => {
        clearInterval(interval)
      }

  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassaed(0)
    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null)

    setCycles((state) => state.map((cycle) => {
      if (cycle.id == activeCycleId) {
        return { ...cycle, interruptedDate: new Date()}
      } else { 
        return cycle
      }
    }))
  }
  

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

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
      
        <NewCycleForm/>
        <Countdown/>
      

      
      
      { activeCycle ?  (
        <StopCountdownButton onClick={handleInterruptCycle} type="button">
        <HandPalm size={24}/>
        Interromper
        </StopCountdownButton>
      ) : (
        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
        <Play size={24}/>
        Começar
        </StartCountdownButton>
      ) }
      </form>
    </HomeContainer>
  )
}
