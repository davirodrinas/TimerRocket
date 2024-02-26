import { ReactNode, createContext, useState, useReducer } from "react";

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

interface CyclesState {
  cycles: Cycles[]
  activeCycleId: string | null
}

export function CyclesConstextProvider({
  children
}: CyclesConstextProviderProps) {
    const [cyclesState, dispatch] = useReducer(
      (state: CyclesState, action: any) => {
      if(action.type == 'ADD_NEW_CYCLE') {
        return {
          ...state, 
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      }

      if(action.type == 'INTERRUPT_CURRENT_CYCLE') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id == state.activeCycleId) {
              return { ...cycle, interruptedDate: new Date()}
            } else { 
              return cycle
            }
          }),
          activeCycleId: null
        }
      }

      return state
    }, 
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
        dispatch({
          type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
          payload: {
            activeCycleId,
          },
        })


      //   setCycles((state) => state.map((cycle) => {
      //     if (cycle.id == activeCycleId) {
      //       return { ...cycle, finishedDate: new Date()}
      //     } else { 
      //       return cycle
      //     }
      //     }),
      //     )
      }

      function CreateNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
    
        const newCycle: cycle = {
          id,
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: new Date(),
        }

        dispatch({
          type: 'ADD_NEW_CYCLE',
          payload: {
            newCycle,
          },
        })
    
       // setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassaed(0)
        //reset();
      }
    
      function InterruptCurrentCycle() {
        dispatch({
          type: 'INTERRUPT_CURRENT_CYCLE',
          payload: {
            activeCycle,
          },
        })

        // setActiveCycleId(null)  
        // setCycles((state) => state.map((cycle) => {
        //   if (cycle.id == activeCycleId) {
        //     return { ...cycle, interruptedDate: new Date()}
        //   } else { 
        //     return cycle
        //   }
        // }),
        // )
        // setActiveCycleId(null)
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
