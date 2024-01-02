import { RedoControl } from "./RedoControl";
import { UndoControl } from "./UndoControl";

export type HistoryControlProps = {

}

export function HistoryControl({ }: HistoryControlProps) {
  return (
    <div className="leaflet-bar history-control">
      <div>{<UndoControl />}</div>
      <div>{<RedoControl />}</div>
    </div>
  )
}