import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

export function NewCycleForm() {
  const newCycleFormValidationSchema =zod.object({
    task: zod.string().min(1, 'Informe a Tarefa'),
    minutesAmount: zod.number()
    .min(1, 'O Cyclo  precisa ser de no maimo 5 minutos.')
    .max(60, 'O Cyclo  precisa ser de no maimo 60 minutos.'),
  })
  
  
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


  const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })


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