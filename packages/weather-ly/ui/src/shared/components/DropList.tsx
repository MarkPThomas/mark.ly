import { useState } from "react"

type props = {
  items: { value: string, name: string }[]
  name: string,
  keyPrefix: string,
  selectedValue?: string,
  noneSelectedValue?: string,
  noneSelectedValueName?: string,
  useNoneSelectedValue?: boolean,
  labelText?: string,
  labelClass?: string,
  id?: string,
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const DropList = (props: props) => {
  const [selectedValue, setSelectedValue] = useState(props.selectedValue ?? '');

  const noneSelectedValueName = props.noneSelectedValueName ?? '-';
  const noneSelectedValue = props.noneSelectedValue ?? '';
  const useNoneSelectedValue = props.useNoneSelectedValue ?? props.noneSelectedValue ?? false;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectedValue(event.currentTarget.value);
    props.onChange && props.onChange(event);
  }

  let key = 0;
  return (
    <>
      {
        props.labelText &&
        <label htmlFor={props.name}>{props.labelText}</label>
      }
      <select id={props.id} name={props.name} onChange={handleChange} value={selectedValue}>
        {
          useNoneSelectedValue &&
          <option value={noneSelectedValue}>{noneSelectedValueName}</option>
        }
        {
          props.items.map(item =>
            <option key={`${props.keyPrefix}-${key++}`} value={item.value}>
              {item.name}
            </option>
          )
        }
      </select>
    </>
  );
}