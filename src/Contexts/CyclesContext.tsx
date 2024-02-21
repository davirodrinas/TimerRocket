import { ReactNode, createContext, useState } from "react";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
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

export function CyclesConstextProvider({children}: CyclesConstextProviderProps) {
    const [cycles, setCycles] = useState<cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassaed, setAmountSecondsPassaed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    function setSecondsPassaed(seconds: number) {
        setAmountSecondsPassaed(seconds)
      }
    
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

      function CreateNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
    
        const newCycle: cycle = {
          id,
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: new Date(),
        }
    
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassaed(0)
        //reset();
      }
    
      function InterruptCurrentCycle() {
        setActiveCycleId(null)
    
        setCycles((state) => state.map((cycle) => {
          if (cycle.id == activeCycleId) {
            return { ...cycle, interruptedDate: new Date()}
          } else { 
            return cycle
          }
        }))
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
