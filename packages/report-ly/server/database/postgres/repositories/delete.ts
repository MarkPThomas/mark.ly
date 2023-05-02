/**
 * Deletes all trips reports.
 * THIS DOES A COMPLETE WIPE!
 * Only use this method for resetting all trip reports cleanly without dropping tables.
 */
public static function deleteAllTripReports() {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = "SELECT id FROM report_trip";
  $query = $database -> prepare($sql);
  $query -> execute();
  $results = $query -> fetchAll();

  $reportIds = [];
  foreach($results as $result)
  {
    $reportIds[] = (int)$result -> id;
  }

  foreach($reportIds as $reportId)
  {
    self:: deleteReportInDatabaseById($reportId);
  }
}

/**
 * Deletes the trip report in the database identified by the provided URL.
 * @param string $pageUrl URL of the report to delete.
 * @return bool True: The trip report was successfully deleted.
 */
public static function deleteReportInDatabaseByUrl($pageUrl) {
  $reportId = self:: getReportIdFromPageUrl($pageUrl);
  $result = self:: deleteReportInDatabaseById($reportId);
  return $result;
}

/**
 * Deletes the trip report in the database identified by the provided ID.
 * @param int $reportId
 * @return bool
 */
public static function deleteReportInDatabaseById($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  try {
    $database -> beginTransaction();


    // Delete page
    $pageId = self:: getPageIdFromReportId($reportId);
    //            $pagePhotoId = PageModel::getPagePhotoId($pageId);    // Not sure if page photo should be deleted. May still be referenced elsewhere.
    $result = PageModel:: deletePage($pageId);
    Lib\MyPDOManager:: confirmTransaction($result);

    // Delete orphaned albums
    $albumIdsToDelete = AlbumModel:: getAlbumIdsOrphanedByReportDelete($reportId);
    foreach($albumIdsToDelete as $albumId){
      $result = AlbumModel:: deleteAlbum($albumId);
      Lib\MyPDOManager:: confirmTransaction($result);
    }

    // Delete orphaned references
    $referenceIdsToDelete = ReferenceModel:: getReferenceIdsOrphanedByReportDelete($reportId);
    foreach($referenceIdsToDelete as $referenceId){
      $result = ReferenceModel:: deleteReference($referenceId);
      Lib\MyPDOManager:: confirmTransaction($result);
    }

    // Delete photos and videos
    $reportPhotoAndVideoIds = self:: getReportPhotoAndVideoIds($reportId);
    foreach($reportPhotoAndVideoIds as $reportPhotoAndVideoId){
      // Delete photos
      $reportPhotoId = $reportPhotoAndVideoId -> report_photo_id;
      if (!empty($reportPhotoId)) {
        $result = PhotoModel:: deleteReportAndBasePhoto($reportPhotoId);
        Lib\MyPDOManager:: confirmTransaction($result);
      }

      // Delete videos
      $reportVideoId = $reportPhotoAndVideoId -> report_video_id;
      if (!empty($reportVideoId)) {
        $result = VideoModel:: deleteReportAndBaseVideo($reportVideoId);
        Lib\MyPDOManager:: confirmTransaction($result);
      }
    }

    // Delete report header (cascades to report bodies)
    $result = self:: deleteReportHeader($reportId);
    Lib\MyPDOManager:: confirmTransaction($result);

    $database -> commit();
  } catch (\Exception $e) {
    $database -> rollback();
    Lib\MyLogger:: log('Error No: '.$e -> getCode(). ' - '.$e -> getMessage(). '<br />');
    Lib\MyLogger:: log(nl2br($e -> getTraceAsString()));
    Session:: add('feedback_negative', Text:: get('FEEDBACK_REPORT_DELETION_FAILED'));
    return false;
  }

  Session:: add('feedback_positive', Text:: get('FEEDBACK_REPORT_DELETION_SUCCESSFUL'));
  return true;
}


/**
 * Deletes the trip report header object.
 * @param int $reportId ID of the report to delete.
 * @return bool True: The trip report was successfully deleted.
 */
public static function deleteReportHeader($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'DELETE FROM report_trip WHERE id = :id';
  $query = $database -> prepare($sql);
  $query -> execute([':id' => $reportId]);

  return ($query -> rowCount() == 1);
}

/**
 * Deletes all report bodies associated with the specified report.
 * @param int $reportId
 * @return bool
 */
public static function deleteReportBodies($reportId) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = 'DELETE FROM report_trip_body
              WHERE report_trip_id = :report_trip_id';
  $query = $database -> prepare($sql);
  $query -> execute([':report_trip_id' => $reportId]);

  return ($query -> rowCount() == 1);
}