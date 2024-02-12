import { useState } from "react";
import { RoutePoint, RouteSegment } from "../../../../../../../../libraries/gis/src/Core/Route";
import { Vertex, Segment } from "../../../../../model/Geometry";
import { INodeOfInterest } from "../../../../../model/Geometry/Stats";
import { LabelValue } from "../../LabelValue";
import { ToggleHeader } from "../../ToggleHeader";

import styles from './RangeStats.module.css';
import stylesAccordion from '../../ToggleGroup.module.css';
import classnames from "classnames";

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
  formatter?: (value: number) => string;
  level: number;
};

export function RangeStats(stats: RangeStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

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

  const className = classnames([
    styles.items,
    { [stylesAccordion.accordionContent]: showAll },
    { [stylesAccordion.accordionContentHide]: !showAll },
  ])

  return (
    <div>
      <div className="toggle-header-show-all">
        <ToggleHeader value="Show All" level={stats.level} isToggled={showAll} cb={handleClick} className={styles.title} />
      </div>
      <LabelValue label={'Min'} value={statsFormatted.min} />
      {showAll ?
        <div className={className}>
          <LabelValue label={'-Std2'} value={statsFormatted.stdMin2} />
          <LabelValue label={'-Std1'} value={statsFormatted.stdMin1} />
        </div> : null
      }
      <LabelValue label={'Avg'} value={statsFormatted.avg} />
      {showAll ?
        <div className={className}>
          <LabelValue label={'Mdn'} value={statsFormatted.mdn} />
        </div>
        : null
      }
      {showAll ?
        <div className={className}>
          <LabelValue label={'+Std1'} value={statsFormatted.stdMax1} />
          <LabelValue label={'+Std2'} value={statsFormatted.stdMax2} />
        </div> : null
      }
      <LabelValue label={'Max'} value={statsFormatted.max} />
    </div>
  )
}