import { CamLine } from './CamLine';

export const CamModel = (props) => {
  const model = props.model;
  const lines = props.model.lines;
  return (
    <div>
      {
        lines.map(line => (
          <CamLine
            key={line._id}
            modelName={model.modelName}
            line={line}
            onCamChange={props.onCamChange}
          />
        ))
      }
    </div>
  );
};