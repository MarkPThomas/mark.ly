import styled from "styled-components";

import { IEditedPolylineStats, PolylineStatsComparison } from "../../Custom/Stats/Paths/PolylineStatsComparison";
import { ToggleGroup } from "../../Custom/ToggleGroup";

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgb(134, 251, 255, 0.7);
`;

export type PolylineComparisonControlProps = {
  statsInitial: IEditedPolylineStats,
  statsCurrent: IEditedPolylineStats
}

export function PolylineComparisonControl({ statsInitial, statsCurrent }: PolylineComparisonControlProps) {
  return (
    <Group>
      <ToggleGroup
        value={'Polyline Comparison Stats'}
        level={1}
        id={'polyline-table-comparison'}
        children={[
          <hr key={Date() + '1'} />,
          <PolylineStatsComparison key={Date() + '2'} statsInitial={statsInitial} statsCurrent={statsCurrent} />
        ]}
      />
    </Group>

  )
}