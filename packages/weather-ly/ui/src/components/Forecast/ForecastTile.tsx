export const ForecastTile = ({
  title,
  url,
  snippet,
  showSnippet,
  temp,
  tempUnit,
  isDaytime
}) => {
  const tempPrefix = isDaytime ? 'High' : 'Low';
  let tempAttr = `forecast-temp ${isDaytime ? 'temp-high' : 'temp-low'}`;

  // TODO:
  // Display snippet as tooltip and collapsed row that can be toggled open & closed
  return (
    <div className="forecast-tile">
      <p className="forecast-title">{title}</p>
      <p>
        <img src={url} alt={snippet} title={snippet} />
      </p>
      {
        showSnippet &&
        <p className="forecast-snippet">{snippet}</p>
      }
      <p className={tempAttr}>{tempPrefix}: {temp} °{tempUnit}</p>
    </div>
  );
}