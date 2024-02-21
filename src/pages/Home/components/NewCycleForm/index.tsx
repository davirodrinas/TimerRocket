import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../..";

const { activeCycle} = useContext(CyclesContext)

export function NewCycleForm() {
    return (
        <FormContainer>
          <label>Vou trabalhar em</label>
          <TaskInput 
            id='task' 
            list="task-suggestions" 
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />

          </datalist>

          <label htmlFor="">Durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5} 
            min={1} 
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', {valueAsNumber: true})}
            />

          <span>Minutos.</span>
        </FormContainer>
    )
}