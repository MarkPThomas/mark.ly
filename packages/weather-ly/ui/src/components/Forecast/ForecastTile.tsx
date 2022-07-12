export const ForecastTile = ({ title, url, snippet, temp, tempUnit, isDaytime }) => {
  const tempPrefix = isDaytime ? 'High' : 'Low';
  let tempAttr = `forecast-temp ${isDaytime ? 'temp-high' : 'temp-low'}`;

  return (
    <div className="forecast-tile">
      <p className="forecast-title">{title}</p>
      <p>
        <img src={url} alt={snippet} title={snippet} />
      </p>
      <p className="forecast-snippet">{snippet}</p>
      <p className={tempAttr}>{tempPrefix}: {temp} °{tempUnit}</p>
    </div>
  );
}