/**
     * Returns the trip report id if the parent page exists. Otherwise, returns false.
     * @param string $pageId
     * @return int|bool
     */
public static function isExisting($pageId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = "SELECT id FROM report_trip WHERE page_id = :pageId";
  $query = $database -> prepare($sql);
  $query -> execute([':pageId' => $pageId]);

  return ($query -> rowCount() !== 0) ? (int)$query -> fetch() -> id : false;
}


/**
* Returns a list of trip reports that are children of the supplied URL.
* @param $pageUrl string URL used as a unique index for looking up the reports.
* @return array|string
*/
public static function getReportsList($pageUrl) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT
  r.id as report_trip_id,
    r.page_id,
    r.status_id AS report_status_id,
      r.report_trip_type_id,
      p.title_menu,
      p.title_full,
      p.description,
      p.url,
      photo.url AS photo_url,
        photo.caption AS photo_caption,
          p.date_created,
          p.status_id AS page_status_id,
            p.tasks,
            p.is_public,
            p.views_count,
            p.user_id
  FROM
              report_trip r
          LEFT JOIN
              page p ON(r.page_id = p.id)
          LEFT JOIN
              photo ON(p.photo_id = photo.id)
          WHERE p.url LIKE:url';
  $query = $database -> prepare($sql);
  $query -> execute([':url' => $pageUrl. '%']);

  $reportPages = [];
  while ($row = $query -> fetch()) {
    $reportPages[] = $row;
  }

  $urlElements = explode('/', $pageUrl);
  $pageGroup = end($urlElements);

  $reportsList = [];
  foreach($reportPages as $page){
    // Strip base URL from the page URL to get the stub
    $pageUrlStub = str_replace($pageUrl, '', $page -> url);
    $reportPageUrl = Lib\PathHelper:: Combine([$pageGroup, $pageUrlStub], $isRoot = false);
    $reportsList[$reportPageUrl] = $page -> title_menu;
  }
  $reportsList = Lib\JsonHandler:: encode($reportsList);
  return $reportsList;
}

/**
* Returns a trip report as a JSON string.
* @param $pageUrl string URL used as a unique index for looking up the reports.
* @return \stdClass|string
*/
public static function getReportByUrlAsJSON($pageUrl) {
  $report = self:: getReportByUrl($pageUrl);
  $jsonReport = $report -> convertToStdClassView();
  $jsonReport = Lib\JsonHandler:: encode($jsonReport);
  return $jsonReport;
}

/**
* Returns a trip report as a JSON string.
* @param $pageId int ID used as a unique index for looking up the reports.
* @return \stdClass|string
*/
public static function getReportByIdAsJson($pageId) {
  $report = self:: getReportById($pageId);
  $jsonReport = $report -> convertToStdClassView();
  $jsonReport = Lib\JsonHandler:: encode($jsonReport);
  return $jsonReport;
}

/**
* Returns a report object based on the page URL.
* @param string $pageUrl URL used as a unique index for looking up the reports.
* @return Report
*/
public static function getReportByUrl($pageUrl) {
  $page = PageModel:: getPageByUrl($pageUrl);
  if (!$page) return null;

  $reportPage = new Db\Page($page);

  $header = self:: getTripReportHeaderByPageId($reportPage -> getId());
  $reportId = $header -> id;

  return self:: getReportById($reportId);
}

/**
* Returns a report object based on the report ID.
* @param int $reportId Report ID used to look up the report and associated page data.
* @return Report
*/
public static function getReportById($reportId) {
  $header = self:: getTripReportHeader($reportId);

  $pageId = $header -> page_id;
  $reportPage = PageModel:: getReportPageById($pageId);
  if (!$reportPage) return null;

  $report = new Report();
  $report -> setHeaderAndPage($header, $reportPage);

  // Validate that the basic report read correctly. Otherwise, abort.
  $reportId = $report -> getHeader() -> getId();
  if (empty($reportId))
    return new Report();

  // Add report body elements
  $reportBodies = self:: getReportBodies($reportId);
  $report -> setBodies($reportBodies);

  // Add albums
  $photoAlbums = AlbumModel:: getReportAlbumsByReportId($reportId);
  $report -> setAlbums($photoAlbums);

  // Add references
  $references = ReferenceModel:: getReportReferencesByReportId($reportId);
  $report -> setReferences($references);

  return $report;
}


/**
* Gets the report header data for all reports.
* @return array
*/
public static function getAllTripReportHeaders() {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT
  id,
    page_id,
    status_id,
    report_trip_type_id
          FROM report_trip';

  $query = $database -> prepare($sql);
  $query -> execute();
  return $query -> fetchAll();
}

/**
* Gets the report header data for the report ID provided.
* @param $reportId
* @return mixed
*/
public static function getTripReportHeader($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT
  id,
    page_id,
    status_id,
    report_trip_type_id
          FROM report_trip
          WHERE id = :id';

  $query = $database -> prepare($sql);
  $query -> execute([':id' => $reportId]);
  return $query -> fetch();
}

/**
* Gets the first report header data for the page ID provided.
* Note that currently if more than one report is associated with a page, the additional pages will not be included.
* @param $pageId
* @return mixed
*/
public static function getTripReportHeaderByPageId($pageId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT
  id,
    page_id,
    status_id,
    report_trip_type_id
          FROM report_trip
          WHERE page_id = :page_id';

  $query = $database -> prepare($sql);
  $query -> execute([':page_id' => $pageId]);
  return $query -> fetch();
}

/**
* @param $reportId
* @return array
*/
public static function getReportBodies($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  // Note: Using a view. Current host does not allow this. Might implement in future hosting.
  //        $sql = 'SELECT * FROM report_trip_body_view
  //                WHERE report_trip_id = :reportId';

  $sql = 'SELECT
  b.report_trip_id AS report_trip_id,
    b.sequence AS sequence,
      header.name AS header_type,
        b.header_value,
        b.text_body AS text_body,
          rp.suppress_caption AS reportPhoto_suppress_caption,
            rp.custom_caption AS reportPhoto_custom_caption,
              p.album_id AS photo_album_id,
                p.url AS photo_url,
                  p.width AS photo_width,
                    p.height AS photo_height,
                      p.caption AS photo_caption,
                        p.latitude AS photo_latitude,
                          p.longitude AS photo_longitude,
                            p.time_stamp AS photo_time_stamp,
                              p.is_public AS photo_is_public,
                                rv.suppress_caption AS reportVideo_suppress_caption,
                                  rv.custom_caption AS reportVideo_custom_caption,
                                    v.album_id AS video_album_id,
                                      v.url AS video_url,
                                        v.width AS video_width,
                                          v.height AS video_height,
                                            v.caption AS video_caption,
                                              v.latitude AS video_latitude,
                                                v.longitude AS video_longitude,
                                                  v.time_stamp AS video_time_stamp,
                                                    v.is_public AS video_is_public
  FROM
    (((((report_trip_body b
              LEFT JOIN header_type header ON((b.header_type_id = header.id)))
              LEFT JOIN report_photo rp ON((b.report_photo_id = rp.id)))
              LEFT JOIN photo p ON((rp.photo_id = p.id)))
              LEFT JOIN report_video rv ON((b.report_video_id = rv.id)))
              LEFT JOIN video v ON((rv.video_id = v.id)))
          WHERE b.report_trip_id = : reportId
          ORDER BY b.report_trip_id, b.sequence';

  $query = $database -> prepare($sql);
  $query -> execute([':reportId' => $reportId]);

  return $query -> fetchAll();
}

/**
* @param $pageUrl
* @return null
*/
public static function getReportIdFromPageUrl($pageUrl) {
  $pageId = PageModel:: getPageIdByUrl($pageUrl);

  $database = DatabaseFactory:: getFactory() -> getConnection();
  $sql = 'SELECT id FROM report_trip WHERE page_id = :page_id';
  $query = $database -> prepare($sql);
  $query -> execute([':page_id' => $pageId]);

  return ($query -> rowCount() === 1) ? $query -> fetch() -> id : null;
}

/**
* @param $reportId
* @return int|null
*/
public static function getPageIdFromReportId($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT page_id FROM report_trip WHERE id = :reportId';
  $query = $database -> prepare($sql);
  $query -> execute([':reportId' => $reportId]);

  return ($query -> rowCount() === 1) ? $query -> fetch() -> page_id : null;
}

/**
* @param $reportId
* @return int|null
*/
public static function getReportPhotoAndVideoIds($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'SELECT report_photo_id, report_video_id
              FROM report_trip_body
              WHERE report_trip_id = :reportId';
  $query = $database -> prepare($sql);
  $query -> execute([':reportId' => $reportId]);
  if ($query -> rowCount() === 0) {
    return false;
  }
  return $query -> fetchAll();
}

/**
* @param $typeName
* @return null
*/
public static function getReportTypeId($typeName) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = "SELECT id FROM report_trip_type WHERE name = :typeName";
  $query = $database -> prepare($sql);
  $query -> execute([':typeName' => $typeName]);

  return ($query -> rowCount() === 1) ? $query -> fetch() -> id : null;
}