export type LoadFileControlProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LoadFileControl({ onChange }: LoadFileControlProps) {
  return (
    <div key={'file open'} className="leaflet-bar item">
      <input type="file" onChange={onChange} />
    </div>
  );
}