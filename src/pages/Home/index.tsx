import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton, } from "./styles";
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds} from 'date-fns'
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";



interface cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)



const newCycleFormValidationSchema =zod.object({
  task: zod.string().min(1, 'Informe a Tarefa'),
  minutesAmount: zod.number()
  .min(1, 'O Cyclo  precisa ser de no maimo 5 minutos.')
  .max(60, 'O Cyclo  precisa ser de no maimo 60 minutos.'),
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  
  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  function markCurrentCycleAsFinished() {
    setCycles((state) => state.map((cycle) => {
      if (cycle.id == activeCycleId) {
        return { ...cycle, finishedDate: new Date()}
      } else { 
        return cycle
      }
      }),
      )
  }

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
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
      <CyclesContext.Provider value={ {activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
        <NewCycleForm/>
        <Countdown />    
      </CyclesContext.Provider>

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
