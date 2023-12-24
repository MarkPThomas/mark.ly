import { RoutePoint, RouteSegment } from "../../../../../model/GIS/Core/Route";
import { Vertex, Segment } from "../../../../../model/Geometry";
import { INodeOfInterest } from "../../../../../model/Geometry/Stats";
import { LabelValue } from "../../LabelValueList";

export type RangeStatsProps<
  TVertex extends Vertex = RoutePoint,
  TSegment extends Segment = RouteSegment
> = {
  min: INodeOfInterest<TVertex, TSegment>;
  stdMin2?: number;
  stdMin1?: number;
  avg: number;
  mdn?: INodeOfInterest<TVertex, TSegment> | number;
  stdMax1?: number;
  stdMax2?: number;
  max: INodeOfInterest<TVertex, TSegment>;
  showAll?: boolean;
  formatter?: (value: number) => string
};

export function RangeStats(stats: RangeStatsProps) {
  const stdMin = stats.stdMin1 ? {
    stdMin2: stats.formatter(stats.stdMin2),
    stdMin1: stats.formatter(stats.stdMin1)
  } : {};

  const stdMax = stats.stdMax1 ? {
    stdMax1: stats.formatter(stats.stdMax1),
    stdMax2: stats.formatter(stats.stdMax2)
  } : {};

  // TODO: Remove later once Median Elevation fixed. VVVVVVV
  const median = typeof stats.mdn === 'number' ? stats.mdn : stats.mdn?.value;

  const statsFormatted = {
    min: stats.formatter(stats.min.value),
    ...stdMin,
    avg: stats.formatter(stats.avg),
    mdn: stats.formatter(median),
    ...stdMax,
    max: stats.formatter(stats.max.value)
  }

  return (
    <div>
      <div>
        <LabelValue label={'Min'} value={statsFormatted.min} />
        {stats.showAll ?
          <div>
            {statsFormatted.stdMin2 ? <LabelValue label={'-Std2'} value={statsFormatted.stdMin2} /> : null}
            {statsFormatted.stdMin1 ? <LabelValue label={'-Std1'} value={statsFormatted.stdMin1} /> : null}
          </div> : null
        }
        <LabelValue label={'Avg'} value={statsFormatted.avg} />
        {(stats.showAll && statsFormatted.mdn) ?
          <LabelValue label={'Mdn'} value={statsFormatted.mdn} /> : null
        }
        {stats.showAll ?
          <div>
            {statsFormatted.stdMax1 ? <LabelValue label={'+Std1'} value={statsFormatted.stdMax1} /> : null}
            {statsFormatted.stdMax2 ? <LabelValue label={'+Std2'} value={statsFormatted.stdMax2} /> : null}
          </div> : null
        }
        <LabelValue label={'Max'} value={statsFormatted.max} />
      </div>
    </div>
  )
}