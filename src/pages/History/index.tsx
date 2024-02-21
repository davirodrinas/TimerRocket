import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../Contexts/CyclesContext";

export function History() {
  const {cycles} = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu historico</h1>

      <HistoryList>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Duração</th>
                <th>Inicio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tarefa</td>
                <td>20 minutos</td>
                <td>Hà 2 meses</td>
                <td>
                  <Status statusColor="green">Concluido</Status>
                </td>
              </tr>
              <tr>
                <td>Tarefa</td>
                <td>20 minutos</td>
                <td>Hà 2 meses</td>
                <td>
                  <Status statusColor="green">Concluido</Status>
                </td>
              </tr>
              <tr>
                <td>Tarefa</td>
                <td>20 minutos</td>
                <td>Hà 2 meses</td>
                <td>
                  <Status statusColor="green">Concluido</Status>
                </td>
              </tr>
              <tr>
                <td>Tarefa</td>
                <td>20 minutos</td>
                <td>Hà 2 meses</td>
                <td>
                  <Status statusColor="yellow">Em andamento</Status>
                </td>
              </tr>
              <tr>
                <td>Tarefa</td>
                <td>20 minutos</td>
                <td>Hà 2 meses</td>
                <td>
                  <Status statusColor="red">Interrompido</Status>
                </td>
              </tr>
            </tbody>
          </table>
      </HistoryList>
    </HistoryContainer>
  )
}
