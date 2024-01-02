import { EditControl } from "./EditControl"


export type EditControlProps = {
}

export function EditingControl({ }: EditControlProps) {

  return (
    <div className="leaflet-bar cleaning-control">
      <div>{<EditControl />}</div>
    </div>
  );
}