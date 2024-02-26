import { ReactNode, createContext, useState, useReducer } from "react";
import { cycle, cyclesReducer} from '../reducers/cycles/reducer'
import { ActionTypes, MarkCurrentCycleAsFinishedAction, addNewCycleAction, interruptCurrentCycleAction } from "../reducers/cycles/actions";
interface CreateCycleData {
    task: string
    minutesAmount: number
}



interface CyclesContextType {
    cycles: cycle[]
    activeCycle: cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassaed: number
    setSecondsPassaed: (seconds : number) => void
    CreateNewCycle: (data: CreateCycleData) => void 
    InterruptCurrentCycle: () => void
  }

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesConstextProviderProps {
    children: ReactNode
}

export function CyclesConstextProvider({
  children
}: CyclesConstextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
  )
    
    const [amountSecondsPassaed, setAmountSecondsPassaed] = useState(0)
    const {cycles, activeCycleId} = cyclesState

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    function setSecondsPassaed(seconds: number) {
        setAmountSecondsPassaed(seconds)
      }
    
      function markCurrentCycleAsFinished() {
        dispatch(MarkCurrentCycleAsFinishedAction())
      }

      function CreateNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
    
        const newCycle: cycle = {
          id,
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassaed(0)
      }
    
      function InterruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
      }

    return (
        <CyclesContext.Provider value={ {
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished, 
            amountSecondsPassaed, 
            setSecondsPassaed,
            CreateNewCycle,
            InterruptCurrentCycle}}>
            
            { children }
         </CyclesContext.Provider>
    )
}
